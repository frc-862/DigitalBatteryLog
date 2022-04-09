const batteryDataModel = require("../../schemas/batterySchema.js");

// hello david, please pass null in if there is no data for that category. 

//accepts all modifiable characteristics of a battery model and updates it based off battery number 
async function submitDataByBatteryNumber(bNum, rintBefore, socBefore, rintAfter, socAfter, purpose, subgroup) {
    let res = await batteryDataModel.findOne({ batteryNumber: bNum, signedOut: true });
    let doc; 
    if (res == null) {
        doc = new batteryDataModel()
        doc.timeOut = new Date().toString();
        doc.signedOut = true;
    } else {
        doc = res;
        doc.timeIn = new Date().toString();
        doc.signedOut = false;
    }
    doc.batteryNumber = bNum;
    //if null or undefined isn't passed into the function, then it will change the values of the doc to match what was passed in
    if (rintBefore != null && rintBefore != undefined) {
        doc.beakBefore.rint = rintBefore;
    } 
    
    if (socBefore != null && socBefore != undefined) {
        doc.beakBefore.soc = socBefore;
    }   

    if (rintAfter != null && rintAfter != undefined) {
        doc.beakAfter.rint = rintAfter;
    } 

    if (socAfter != null && socAfter != undefined) {
        doc.beakAfter.soc = socAfter;
    }

    if (purpose != null && purpose != undefined) {
        doc.purpose = purpose;
    }

    if (subgroup != null && subgroup != undefined) {
        doc.subgroup = subgroup;
    }
    //sets updated state of doc to false so it will be updated by sync function
    doc.updated = false;
    doc.save();
    

}

module.exports = submitDataByBatteryNumber;