importClass(Packages.com.ibm.security.access.user.User);
importClass(Packages.com.ibm.security.access.user.UserLookupHelper);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

//Get Hostname of the requesting webseal
var hostname = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "hostname");
IDMappingExtUtils.traceString("Hostname Acquired: " + hostname);

//Define Cache to simplify the mapping rules
var cache = IDMappingExtUtils.getIDMappingExtCache()

/*
 *  Validates, that the email is a valid email address.
 */
function validateEmail(email) {
    var re = /^(([^\W_])([^\W]?)[\.\-]?){1,}\@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im

    IDMappingExtUtils.traceString("Email verification result: " + re.test(email));
    return re.test(email);
}

/*
 *  UTF8 Decode the parameter
 */
function utf8decode(value) {
    if (value == null || value.length == 0) {
        return "";
    }
    return decodeURIComponent(escape(value));
}

/*
 * Generate Nonce (Number only once) for email verification
 */
function generateNonce(seed) {
    function s4() {
        return Math.floor((1 + seed + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/*
 * Handle Errors 
 */
function buildErrorString(errors, missing) {
    var errorString = "",
        error;

    if (missing.length != 0) {
        errorString += "Please fill the following field: " + missing;
    }

    for (error in errors) {
        if (errorString != "") {
            errorString += "<br/>";
        }
        errorString += "Error: ";
        errorString += errors[error];
    }
    return errorString;
}