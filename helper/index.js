'use strict';

import { toast } from 'react-toastify';


export const notifyInfo  = text => toast.info(text);

export const notifyError = text => toast.error(text);

export const formatDate = date => {
  
  const dateTime    = new Date(date)
  const months      = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  const leadingZero = time => `${time}`.padStart(2, '0');

  return months[dateTime.getMonth()]   + " " + 
    leadingZero(dateTime.getDate())    + " " +  
    dateTime.getFullYear()             + " at " + 
    leadingZero(dateTime.getHours())   + ":" + 
    leadingZero(dateTime.getMinutes()) + ".";
  
}
  
export const removeItemFromArr = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

