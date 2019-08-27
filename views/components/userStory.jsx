import React from 'react';
import AppTitle from './common/appTitle.jsx';

const UserStory = () => {
  return (
    <div className="inner-container">
      
      <AppTitle title={<h1>Issue Tracker</h1>} />
      <div className="user-story" >
        <h2>User Story</h2>
        <ol>
          <li>Prevent cross site scripting(XSS attack).</li>
          
          <li>I can <b>POST</b> <code>/api/issues/{'{'}projectname{'}'}</code> with form data containing required <i>issue_title</i>, <i>issue_text</i>, <i>created_by</i>, and optional <i>assigned_to</i> and <i>status_text</i>.</li>
          
          <li>The object saved (and returned) will include all of those fields (blank for optional no input) and also include <i>created_on</i>(date/time), <i>updated_on</i>(date/time), <i>open</i>(boolean, true for open, false for closed), and <i>_id</i>.</li>
          
          <li>I can <b>PUT</b> <code>/api/issues/{'{'}projectname{'}'}</code> with a <i>_id</i> and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update <i>updated_on</i>. If no fields are sent return 'no updated field sent'.</li>
          
          <li>I can <b>DELETE</b> <code>/api/issues/{'{'}projectname{'}'}</code> with a <i>_id</i> to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.</li>
          
          <li>I can <b>GET</b> <code>/api/issues/{'{'}projectname{'}'}</code> for an array of all issues on that specific project with all the information for each issue as was returned when posted.</li>
          
          <li>I can filter my get request by also passing along any field and value in the query(ie. <code>/api/issues/{'{'}project{'}'}?open=false</code>). I can pass along as many fields/values as I want.</li>
          
          <li>All 11 functional tests are complete and passing.</li>
          
        </ol>
      </div>      
      
    </div>
  );
}

export default UserStory;