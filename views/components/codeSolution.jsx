import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import AppTitle from './common/appTitle.jsx';

const CodeSolution = () => {

  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Issue Tracker</h1>} />
      <div className="code-solution">
        <h2>Code Solution</h2>
        <ol>
          
          <li>Prevent cross site scripting(XSS attack).</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q1}
          </SyntaxHighlighter>
          
          <li>I can <b>POST</b> <code>/api/issues/{'{'}projectname{'}'}</code> with form data containing required <i>issue_title</i>, <i>issue_text</i>, <i>created_by</i>, and optional <i>assigned_to</i> and <i>status_text</i>.</li>
          
          <li>The object saved (and returned) will include all of those fields (blank for optional no input) and also include <i>created_on</i>(date/time), <i>updated_on</i>(date/time), <i>open</i>(boolean, true for open, false for closed), and <i>_id</i>.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q2}
          </SyntaxHighlighter>
          
          <li>I can <b>PUT</b> <code>/api/issues/{'{'}projectname{'}'}</code> with a <i>_id</i> and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update <i>updated_on</i>. If no fields are sent return 'no updated field sent'.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q3}
          </SyntaxHighlighter>
          
          <li>I can <b>DELETE</b> <code>/api/issues/{'{'}projectname{'}'}</code> with a <i>_id</i> to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q4}
          </SyntaxHighlighter>
          
          <li>I can <b>GET</b> <code>/api/issues/{'{'}projectname{'}'}</code> for an array of all issues on that specific project with all the information for each issue as was returned when posted.</li>
          
          <li>I can filter my get request by also passing along any field and value in the query(ie. <code>/api/issues/{'{'}project{'}'}?open=false</code>). I can pass along as many fields/values as I want.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q5}
          </SyntaxHighlighter>
          
          <li>All 11 functional tests are complete and passing.</li>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q6_1}
          </SyntaxHighlighter>
          
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {q6_2}
          </SyntaxHighlighter>
          
        </ol>
      </div>   
      
    </div>
  );
}

  const q1 = `app.use(helmet());`
  
  const q2 = `app.route('/api/issues/:project')

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
        if (error) return next(error.details[0].message);
        
        const collection = await connect(project);
        const insertedIssue = await collection.insertOne(issue)
        if(!insertedIssue) return next(newError('Sorry could not add issue. try again! thanks', 400))
       
        issue._id = insertedIssue.insertedId;
        res.json({success: true, issue, message: 'Issue successfully added'});

      } catch(err) {
        res.json(err)
      }
  })`
  
  const q3 = `.put(async (req, res, next) => {
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

})`
  
  const q4 = `.delete(async (req, res, next) => {
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
});`
  
  const q5 = `.get(async (req, res) => {
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
})`
  
  const q6_1 = `suite('Functional Tests', function() {
  
  let id1;
  let id2;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue.issue_title, 'Title');
          assert.equal(res.body.issue.issue_text , 'text');
          assert.equal(res.body.issue.created_by , 'Functional Test - Every field filled in');
          assert.equal(res.body.issue.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.issue.status_text, 'In QA');
          assert.equal(res.body.issue.open, true);
         
          assert.property(res.body.issue, '_id');
          assert.property(res.body.issue, 'issue_title');
          assert.property(res.body.issue, 'issue_text');
          assert.property(res.body.issue, 'created_by');
          assert.property(res.body.issue, 'created_on');
          assert.property(res.body.issue, 'updated_on');
          assert.property(res.body.issue, 'assigned_to');
          assert.property(res.body.issue, 'status_text');
          assert.property(res.body.issue, 'open');
         
          id1 = res.body.issue._id;

          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title 2',
          issue_text: 'text 2',
          created_by: 'Functional Test - Required fields filled in 2'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue.issue_title, 'Title 2');
          assert.equal(res.body.issue.issue_text , 'text 2');
          assert.equal(res.body.issue.created_by , 'Functional Test - Required fields filled in 2');
          assert.equal(res.body.issue.assigned_to, '');
          assert.equal(res.body.issue.status_text, '');
          assert.equal(res.body.issue.open, true);
          
          assert.property(res.body.issue, '_id');
          assert.property(res.body.issue, 'issue_title');
          assert.property(res.body.issue, 'issue_text');
          assert.property(res.body.issue, 'created_by');
          assert.property(res.body.issue, 'created_on');
          assert.property(res.body.issue, 'updated_on');
          assert.property(res.body.issue, 'assigned_to');
          assert.property(res.body.issue, 'status_text');
          assert.property(res.body.issue, 'open');

          id2 = res.body.issue._id;  
          
          done();
        });    
      });
      
      test('Missing required fields', (done) => {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_text: 'text',
          created_by: 'Functional Test - Missing required fields',
          assigned_to: 'Chai and Mocha'
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, "\"issue_title\" is required");
          done();
        });   
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', () => {
      
      test('No body', (done) => {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: id1})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, 'no updated field sent');
          done();
        });   
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: id1, issue_title: 'new title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'successfully updated');
          done();
        });  
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: id2, issue_text: 'new text', open: 'false'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'successfully updated');
          done();
        });  
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', (done) => {
        chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({open: false})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body[0].open, false);
          assert.equal(res.body[0].issue_text, 'new text');
          
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.error, '_id error');
          done();
        });  
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'deleted '+ id2);
          done();
        }); 
      });
      
    });

});
`
  
  const q6_2 = `Functional Tests

    POST /api/issues/{project} => object with issue data

      ✓ Every field filled in (538ms)

      ✓ Required fields filled in (650ms)

      ✓ Missing required fields

    PUT /api/issues/{project} => text

      ✓ No body

      ✓ One field to update (787ms)

      ✓ Multiple fields to update (515ms)

    GET /api/issues/{project} => Array of objects with issue data

      ✓ No filter (706ms)
      ✓ One filter (416ms)

      ✓ Multiple filters (test for multiple fields you know will be in the db for a return) (644ms)

    DELETE /api/issues/{project} => text

      ✓ No _id

      ✓ Valid _id (436ms)



  11 passing (5s)`

export default CodeSolution;