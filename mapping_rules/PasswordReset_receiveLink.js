importMappingRule("PasswordReset_Utility");

IDMappingExtUtils.traceString("Entry PasswordReset_receiveLink.js");

var nonce = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "nonce");
IDMappingExtUtils.traceString("Received a nonce of: " + nonce);


if (nonce != null && nonce != "") {

    if (cache.exists(nonce)) {

        var uid = cache.getAndRemove(nonce);

        IDMappingExtUtils.traceString("Loaded the follwing userdata:");
        IDMappingExtUtils.traceString("username = " + uid);

        context.set(Scope.SESSION, "urn:passwordReset:attributes", "uid", uid);

        success.setValue(true);
    } else {
        success.setValue(false);

        IDMappingExtUtils.traceString("The recieved nonce was invalid: " + nonce);
        macros.put("@ERROR_MESSAGE@", "Your session id was invalid. Looks like you used an invalid or expired link.");
        page.setValue("/authsvc/server_error.html");
    }
} else {
    success.setValue(false);

    IDMappingExtUtils.traceString("No nonce found");
    macros.put("@ERROR_MESSAGE@", "Technical error: No session id was present.");
    page.setValue("/authsvc/server_error.html");
}

IDMappingExtUtils.traceString("Exit PasswordReset_receiveLink.js");