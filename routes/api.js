/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const Joi = require('joi');

require('dotenv').config()

const URL = process.env.DB; //MongoClient.connect(CONNECTION_STRING, err, db)  => {});

function validate(req) {
  const schema = {
    issue_title : Joi.string().min(3).max(50).required(),
    issue_text  : Joi.string().min(3).max(255).required(),
    created_by  : Joi.string().min(3).max(50).required(),
    assigned_to : Joi.string().max(50).allow(''),
    status_text : Joi.string().max(50).allow('')
  };

  return Joi.validate(req, schema, { stripUnknown: true });
}

async function connect(project) {
  const db = await MongoClient.connect(URL)
  return db.collection(project);
}

const newError = (message, status) => { 
  const error = new Error(message); 
  error.status = status; 
  return error
}

module.exports = (app) => {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      try{
        const {project} = req.params;
        const q = req.query;

        if(q._id) q._id = new ObjectId(q._id)
        if(q.open) q.open = q.open === "true"

        const collection = await connect(project);
        collection.find(q).sort({ created_on: -1 }).toArray((err, docs) => res.json(docs));

      } catch(err){
        res.json(err)
      }
    })
    
    .post(async (req, res, next) => {
      try {
        const {project} = req.params;
        const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body

        const issue = {
          issue_title,
          issue_text,
          created_by,
          created_on  : new Date(),
          updated_on  : new Date(),
          assigned_to : assigned_to || '',
          status_text : status_text || '',
          open        : true
        };
     
        const { error } = validate(issue);
        if (error) return next(newError(error.details[0].message, 400));
        
        const collection = await connect(project);
        const insertedIssue = await collection.insertOne(issue)
        if(!insertedIssue) return next(newError('Sorry could not add issue. try again! thanks', 400))
       
        issue._id = insertedIssue.insertedId;
        res.json({success: true, issue, message: 'Issue successfully added'});

      } catch(err) {
        res.json(err)
      }
      
    })
    
    .put(async (req, res, next) => {
      try{
        const {project} = req.params;
        const id        = req.body._id;
        let updates     = req.body;
        
        delete updates._id;
        for (let key in updates) { 
          if (!updates[key]) delete updates[key] 
        }
        
        if(updates.open) updates.open = updates.open === "true"
        if(Object.keys(updates).length === 0) return next(newError('no updated field sent', 400));
        
        const collection = await connect(project);
        const issue = await collection.findOne({_id : new ObjectId(id)})
        if(!issue) return next(newError('could not find ' + id, 400))
        
        delete issue._id;
        updates = {...issue, ...updates}
        
        const { error } = validate(updates);
        if (error) return next(error.details[0].message);
        
        const update = await collection.update({_id : new ObjectId(id)}, updates)
        if(!update) return next(newError('could not update ' + id, 400))

        res.json({success: true, message: 'successfully updated'})
        
      } catch(err){
        res.json(err)
      }
      
    })
    
    .delete(async (req, res, next) => {
      try{
        const project = req.params.project;
        const id = req.body._id;

        if(!id) return next(newError('_id error', 400));

        const collection = await connect(project);
        const deletedIssue = await collection.findAndRemove({_id: new ObjectId(id)});

        if (!deletedIssue) return next(newError('could not delete '+ id, 400));
        res.json({success: true, message: 'deleted '+ id}) 
        
      } catch(err) {
        res.json(err)
      }
    });
    
};
