importMappingRule("ML_Utility");

IDMappingExtUtils.traceString("Entry ML_getUser.js");

var errors = [];
var missing = [];
var rc = true;
var first = false;

/*
 * Verify if the script runs the first time.
 * With this, we ensure that no missing paramter message is displayed on the first run of the script.
 */
if (state.get("first_getUser") == null && (email == null || email == "")) {
    first = true;
    state.put("first_getUser", "false");
    rc = false;
}


/* 
 * Store the initial requested URL so we can redirect the user after the login
 */
var targetURL = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "targetURL"));
if (targetURL != null && targetURL != "") {
    IDMappingExtUtils.traceString("Set targetURL to:" + targetURL);
    context.set(Scope.SESSION, "urn:MagicLink:attributes", "targetURL", targetURL);
} else {
    IDMappingExtUtils.traceString("TargetURL is null or empty");
}


/*
 * Load and validate the email
 */
var email = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "email"));
if (null == email || email == "") {
    missing.push("Email");
    rc = false;
} else if (!validateEmail(email)){
    errors.push("Email addresses is not valid.")
    rc = false;
}


/*
 * Get UserLookupHelper
 */
if (rc == true) {
    var hlpr = new UserLookupHelper();
    hlpr.init(true);
}

if (rc == true && hlpr.isReady()) {

    var searched = hlpr.search("mail", email, 10);

    if (searched.length < 1) {
        /* 
         * No user was found.
         * You could either query for other attributes, or you could still provide a success page to the user using: 
         * page.setValue("/path/to/template_file")
         * For debugging purpose, we provide an error message to the user
         */ 
        errors.push("No user found.")
        rc = false;
    } else if (searched.length > 1) {
        /*
         * Multiple Users have been found.
         * If multiple users have the same email, magic links cannot be used.
         */
        errors.push("Multiple users found.")
        rc = false;
    } else {
        /*
        * User was found and email is unique
        */
        IDMappingExtUtils.traceString("Found user " + searched[0] + " from email " + email + ".");
        userDN = searched[0]
        user = hlpr.getUserByNativeId(userDN);

        if (user != null) {

            var uid = user.getId()
            IDMappingExtUtils.traceString("Adding userinfo into urn:MagicLink:attributes");
    
            context.set(Scope.SESSION, "urn:MagicLink:attributes", "uid", uid);
            context.set(Scope.SESSION, "urn:MagicLink:attributes", "email", email);
        } else {
        /*
         * Some error occured since we could not get a user from the DN.
         */
        errors.push("Some error occured during user loading.")
        rc = false;
        }    
    }
}

/* 
 * Build and set the error string
 */ 
var errorString = buildErrorString(errors, missing);
if (!first && errorString.length != 0) {
    macros.put("@ERROR_MESSAGE@", errorString);
}

success.setValue(rc)

IDMappingExtUtils.traceString("Exit ML_getUser.js");

