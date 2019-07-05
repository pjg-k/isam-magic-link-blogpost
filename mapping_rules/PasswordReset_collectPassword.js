importMappingRule("PasswordReset_Utility");

IDMappingExtUtils.traceString("entry PasswordReset_collectPassword.js");


var scimConfig = context.get(Scope.SESSION, "urn:ibm:security:asf:policy", "scimConfig");
var errors = [];
var missing = [];
var rc = true;
var first = false;

if (state.get("first_collectPassword") == null) {
    first = true;
    state.put("first_collectPassword", "false");
    rc = false;
}

//The email address becomes user name. We cannot retrieve scim id based on that. The state cache was used earlier to insert the id.
var uid = context.get(Scope.SESSION, "urn:passwordReset:attributes", "uid");
IDMappingExtUtils.traceString("Received username:" + uid);

/*
 * Check that the passwords are present and match.
 */
var password = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "password"));
var passwordConfirm = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "passwordConfirm"));

if (null == password || password == "") {
    missing.push("password");
    rc = false;
} else if (password != passwordConfirm) {
    errors.push("Passwords do not match.");
    rc = false;
} else if (!validatePasswordComplexity(password)) {
    errors.push("Password is not complex enough.");
    rc = false;
}


/*
 * Get UserLookupHelper
 */
if (rc == true) {
    var hlpr = new UserLookupHelper();
    hlpr.init(true);
}


/*
 * Look if we can find a user
 */
if (rc == true && hlpr.isReady()) {
    var user = hlpr.getUser(uid);

    if (user != null) {
        /*
         * Update the password using the User Lookup Helper
         */
        IDMappingExtUtils.traceString("Initiating UserHelper set password operation.");
        var setStatus = user.setPassword(password);

        if (setStatus) {
            IDMappingExtUtils.traceString("Successfully set password.");
        } else {
            IDMappingExtUtils.traceString("UserLookupHelper error: " + user.getErrMessage());
            errors.push("UserLookupHelper error: " + user.getErrMessage());
            page.setValue("/authsvc/user_error.html");
            rc = false;
        }
    } else {
        IDMappingExtUtils.traceString("User NOT found. Tried to search for " + uid);
        rc = false;
        errors.push("Error user is null");
        page.setValue("/authsvc/user_error.html");
    }
}


var errorString = buildErrorString(errors, missing);
if (!first && errorString.length != 0) {
    macros.put("@ERROR_MESSAGE@", errorString);
}
/*
 * Done!
 */

success.setValue(rc);

IDMappingExtUtils.traceString("exit PasswordReset_collectPassword.js");