const batteryDataModel = require("../../schemas/batterySchema");

//please pass null in if there is no data for that category. 
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

    if (rintBefore != null || rintBefore != undefined) {
        doc.beakBefore.rint = rintBefore;
    } 
    
    if (socBefore != null || socBefore != undefined) {
        doc.beakBefore.soc == socBefore;
    }   

    if (rintAfter != null || rintAfter != undefined) {
        doc.beakAfter.rint = rintAfter;
    } 

    if (socAfter != null || socAfter != undefined) {
        doc.beakAfter.soc = socAfter;
    }

    if (purpose != null || purpose != undefined) {
        doc.purpose = purpose;
    }

    if (subgroup != null || subgroup != undefined) {
        doc.subgroup = subgroup;
    }
    
    doc.updated = false; 

}

module.exports = submitDataByBatteryNumber;