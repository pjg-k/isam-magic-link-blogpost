importMappingRule("ML_Utility");

IDMappingExtUtils.traceString("Entry ML_sendLinkSuccess.js");

/*
 * Populate the page macros.
 */
var uid = context.get(Scope.SESSION, "urn:MagicLink:attributes", "uid");

IDMappingExtUtils.traceString("Populating macros:");
IDMappingExtUtils.traceString("@UID@ = " + uid);

macros.put("@UID@", uid);

/*
 * Indicate to the AuthSvc that we are finished and do not want to create a session.
 */
success.endPolicyWithoutCredential();

IDMappingExtUtils.traceString("Exit ML_sendLinkSuccess.js");