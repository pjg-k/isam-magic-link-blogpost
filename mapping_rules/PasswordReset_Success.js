importMappingRule("PasswordReset_Utility");

IDMappingExtUtils.traceString("Entry PasswordReset_sendLinkSuccess.js");

/*
 * Populate the page macros.
 */
var uid = context.get(Scope.SESSION, "urn:passwordReset:attributes", "uid");

IDMappingExtUtils.traceString("Populating macros:");
IDMappingExtUtils.traceString("@UID@ = " + uid);

macros.put("@UID@", uid);

/*
 * Indicate to the AuthSvc that we are finished and do not want to create a session.
 */
success.endPolicyWithoutCredential();

IDMappingExtUtils.traceString("Exit PasswordReset_sendLinkSuccess.js");