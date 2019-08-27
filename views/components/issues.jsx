import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

import {notifyInfo, notifyError, formatDate, removeItemFromArr} from '../../helper';

const url = '/api/issues/apitest';


const Issues = ({issues, setIssues}) => {

  
  const [updateIssue, setUpdateIssue] = useState([]);
  const [deleteModal, setDeleteModal] = useState([]);
  
  
  useEffect(() => {
    
    fetch(url)
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      setIssues(data)
    })
    .catch(error => console.error('Error:', error));
    
  }, [])
  

  const showDeleteModal = ({issueId, issueIdx}) => {
    
    const modalIdx = deleteModal.indexOf(issueId);
  
    return (
       <div className="modal">
         <h3>Delete this Issue?</h3>
         <button className="modal-btn" onClick={e => handleDelete({e, issueId, issueIdx})}>Delete</button>
         <button className="modal-btn" onClick={() => cancelDelete(modalIdx)}>Cancel</button>
       </div>
    );
  }
  
  const handleUpdate = ({e, _id, updateIdx, idx, created_on}) => {
    e.preventDefault();
    
    const data = new FormData(e.target);
    let obj = {};
    data.forEach((value, key) => obj[key] = value);
    obj = {_id, updated_on: new Date(), ...obj}
    
    const btn = e.target[5];
    btn.disabled = true;
    
    console.log(created_on)
  
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(obj), 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      
      btn.disabled = false;
      
      if(!data.success) return notifyError(data.error)
      
      issues[idx] = {created_on, ...obj}
      setIssues(issues)
      cancelUpdate(updateIdx)
      notifyInfo(data.message)
      
    })
    .catch(error => console.error('Error:', error));

    
  }
  
  
  const handleDelete = ({e, issueId, issueIdx}) => {
    
    const btn = e.target;
    btn.disabled = true;
    
    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({_id: issueId}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      
      btn.disabled = false;
      
      if(!data.success) return notifyError(data.error)
      
      notifyInfo(data.message)
      
      setIssues(removeItemFromArr(issues, issueIdx))

    })
    .catch(error => console.error('Error:', error));

 }
  
  
 const cancelUpdate = idx => {
    setUpdateIssue(removeItemFromArr(updateIssue, idx))
 }
  
  
 const cancelDelete = idx => {
    setDeleteModal(removeItemFromArr(deleteModal, idx))
 }
  
  
  return (
    <div className="board">
      <h2>All submitted  issues</h2>
      
      <div className="issues">
        
        {issues[0] === undefined && <h3>No Issues so far.</h3>}
        
        {issues[0] !== undefined && issues.map((issue, i) => {
          
          const updateIdx = updateIssue.indexOf(issue._id)

          return (
            <div key={issue._id}  className="issue" >

              {deleteModal.includes(issue._id) && showDeleteModal({issueId: issue._id, issueIdx: i})}

              {!updateIssue.includes(issue._id) && 
                <React.Fragment>
                  <button 
                  className="update"
                  title="Update Issue" 
                  onClick={() => setUpdateIssue(updateIssue.concat(issue._id))}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button 
                    className="delete"
                    title="Delete Issue"
                    onClick={() => setDeleteModal(deleteModal.concat(issue._id))}
                  >
                    <i className="far fa-trash-alt"></i>
                  </button>

                  <h3  className="issue-title">{issue.issue_title}</h3>
                  <div className="issue-text">{issue.issue_text}</div>
                  <div className="issue-author">created by: {issue.created_by}</div>
                  {issue.assigned_to && <div className="issue-assigned">assigned to: {issue.assigned_to}</div>}
                  {issue.status_text && <div className="issue-status">status text: {issue.status_text}</div>}
                  <div className="issue-created">created on: {formatDate(issue.created_on)}</div>
                  <div className="issue-updated">updated on: {formatDate(issue.updated_on)}</div>
                  
                </React.Fragment>
              }

              {updateIssue.includes(issue._id) && 
                <div className="form-container">

                  <form className="submit-update-form" onSubmit={e => handleUpdate({e, _id: issue._id, updateIdx, idx: i, created_on: issue.created_on})}>

                    <input className="form-title" type="text" name="issue_title" defaultValue={issue.issue_title} required/>
                    <textarea className="form-text" type="text" name="issue_text" defaultValue={issue.issue_text} required/>
                    <input className="form-created" type="text" name="created_by" defaultValue={issue.created_by} required/>
                    <input className="form-assigned" type="text" name="assigned_to" defaultValue={issue.assigned_to} placeholder="(opt) Assigned to"/>
                    <input className="form-status" type="text" name="status_text" defaultValue={issue.status_text} placeholder="(opt) Status text"/>
                    <input className="form-submit" type="submit" value="Update"/>
                    <input className="form-cancel" type="submit" value="Cancel" onClick={() => cancelUpdate(updateIdx)}/>
                  </form>

              </div>
             }
            </div>
          )
      })}
      </div>
    </div>
  );
  
}


export default Issues;