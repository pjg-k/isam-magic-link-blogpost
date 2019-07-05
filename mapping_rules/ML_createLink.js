importMappingRule("ML_Utility");

IDMappingExtUtils.traceString("Entry ML_createLink.js");

var errors = [];
var missing = [];
var rc = true;

var uid = context.get(Scope.SESSION, "urn:MagicLink:attributes", "uid");
var email = context.get(Scope.SESSION, "urn:MagicLink:attributes", "email");
var targetURL = context.get(Scope.SESSION, "urn:MagicLink:attributes", "targetURL");
if (targetURL == null) {
    targetURL = "none"
}


if (uid != null && uid != "" && email != null && email != "") {

    //Create nonce as unique identifier for mail verification
    do {
        nonce = generateNonce(Math.random());
        nonce_exist = cache.exists(nonce);
    } while (nonce_exist);

    // Define how long the link is valid (in seconds)
    sessionLifetime = 900


    /* 
     * Store the uid under the nonce. So we can retreive it when the link is clicked.
     * Also store the Target URL to ensure the redirect is correct.
     */
    cache.put(nonce, uid, sessionLifetime);
    cache.put(nonce + "_targetURL", targetURL, sessionLifetime);

    IDMappingExtUtils.traceString("Stored uid: '" + uid + "' under nonce: '" + nonce + " ' for Lifetime: " + sessionLifetime)


    var magicLinkId = "magiclink"
    /*
     * Create URL including the nonce
     * Note: The hostname is set in the Utility JS, so it's always available when the script is included
     */
    var link = "https://" + hostname + "/mga/sps/authsvc/policy/" + magicLinkId + "?nonce=" + nonce;

    //Set required attributes for email message
    context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "uid", uid);
    context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "email", email);
    context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "link", link);
} else {
    /*
     * Somehow we could not load the uid or email
     */
    IDMappingExtUtils.traceString("Some error occured. Uid: " + uid + " Email: " + email)
    errors.push("Some error occured during user loading.")
    rc = false;
    page.setValue("/authsvc/server_error.html");
}

/* 
 * Build and set the error string
 */
var errorString = buildErrorString(errors, missing);
if (errorString.length != 0) {
    macros.put("@ERROR_MESSAGE@", errorString);
}

success.setValue(rc)

IDMappingExtUtils.traceString("Exit ML_createLink.js");