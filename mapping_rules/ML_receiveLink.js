importMappingRule("ML_Utility");

IDMappingExtUtils.traceString("Entry ML_receiveLink.js");

var nonce = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "nonce");
IDMappingExtUtils.traceString("Received a nonce of: " + nonce);


if (nonce != null && nonce != "") {

    if (cache.exists(nonce)) {

        var uid = cache.getAndRemove(nonce);
        var targetURL = cache.getAndRemove(nonce + "_targetURL");

        IDMappingExtUtils.traceString("Loaded the follwing userdata:");
        IDMappingExtUtils.traceString("username = " + uid);
        IDMappingExtUtils.traceString("targetURL = " + targetURL);

        context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", uid);

        if (targetURL != "none") {
            context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "itfim_override_targeturl_attr", targetURL);
        }

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

IDMappingExtUtils.traceString("Exit ML_receiveLink.js");