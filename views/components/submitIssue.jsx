import React, {useState, useEffect} from 'react';

import {notifyInfo, notifyError} from '../../helper';

const url = '/api/issues/apitest';


const SubmitIssue = ({issues, setIssues}) => {
  
  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    var obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      if(!data.success) return notifyError(data.error)
      
      notifyInfo(data.message)
      setIssues([data.issue, ...issues])
      
    })
    .catch(error => console.error('Error:', error));
  }
  
  return (
    <div className="submit-issue">
      <h3>Submit an issue</h3>
      
      <div className="form-container">
        
          <form className="submit-issue-form" onSubmit={handleSubmit}>
            
            <input className="form-title" type="text" name="issue_title" placeholder="*Title" required/>
            <textarea className="form-text" type="text" name="issue_text" placeholder="*Text" required/>
            <input className="form-created" type="text" name="created_by" placeholder="*Created by" required/>
            <input className="form-assigned" type="text" name="assigned_to" placeholder="(opt) Assigned to"/>
            <input className="form-status" type="text" name="status_text" placeholder="(opt) Status text"/>
            <input className="form-submit" type="submit" value="Submit"/>
            
          </form>
        
      </div>
      
    </div>
  );
  
}

export default SubmitIssue;