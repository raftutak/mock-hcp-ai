if (
  typeof cindi.user.languageCode !== "undefined" &&
  typeof cindi.user.countryCode !== "undefined"
) {
  cindi.user.locale =
    `${cindi.user.languageCode}-${cindi.user.countryCode}`.toLowerCase();
} else {
  cindi.user.locale = null;
}

console.log(`${cindi.user.locale} - market specific file loaded `);

cindi.user.enabledProviders = "facebook,googleplus,linkedin";
cindi.featureFlags.blockSocialLoginAccess = true;
cindi.featureFlags.hideAndSelectAllTopicsOnRegistration = true;
cindi.featureFlags.enableAccountActivation = true;
cindi.featureFlags.disableEmailInVerificationPending = true;
cindi.featureFlags.changePasswordMessageImproved = true;
cindi.featureFlags.hideDeleteOnlineAccount = true;
cindi.featureFlags.hideDataPrivacyRequest = true;
cindi.featureFlags.subscriptionsToCommunicationTopics = true;
cindi.featureFlags.consentForProfiling.enable = true;
cindi.featureFlags.consentForProfiling.defaultRegistrationValue = true;
cindi.featureFlags.consentForProfiling.hideEditProfile = true;
cindi.featureFlags.consentForProfiling.displayCheckboxEditProfile = false;
cindi.featureFlags.NEW_DESIGN = true;
cindi.featureFlags.activationEmailVerificationSentScreen = true;

function initValues(event) {
  if (
    event.currentScreen === "cindi-registration-screen3" ||
    event.currentScreen === "cindi-update-communication-preferences"
  ) {
    [...document.querySelectorAll("#cindi-select-all-channels")].forEach(
      (e) => (e.style.display = "none")
    );
    [...document.querySelectorAll("#cindi-unselect-all-channels")].forEach(
      (e) => (e.style.display = "none")
    );
    [...document.querySelectorAll(".subs-widget-container")].forEach(
      (e) => (e.style.display = "flex")
    );
    [...document.querySelectorAll(".gigya-input-checkbox")].forEach((e) =>
      e.setAttribute("style", "width:0px;height:0px")
    );
    [...document.querySelectorAll(".subscription-name-label")].forEach((e) =>
      e.setAttribute("style", "margin-left:0px")
    );
  }
}

if (typeof cindi.countrySpecificFunctions !== "undefined") {
  cindi.countrySpecificFunctions.initValues = initValues;
}

// field controller country specific settings
// cindi-registration-screen
cindi.fields["cindi-registration-screen"]["purposeStatementLabel"] = {
  isVisible: true,
};
// cindi.fields["data.c_other.title"] = { isVisible: true, isRequired: true };
// cindi.fields["profile.firstName"] = { isVisible: true, isRequired: true };
// cindi.fields["data.c_other.middleName"] = {
//   isVisible: true,
//   isRequired: false,
// };
// cindi.fields["profile.lastName"] = { isVisible: true, isRequired: true };
// cindi.fields["data.c_other.nickname"] = { isVisible: true };
cindi.fields["data.c_affiliation.city"] = { isVisible: true, isRequired: true };
cindi.fields["data.c_personalAddress.country"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["preferences.privacy.roche_privacy_policy"] = { isVisible: true };
cindi.fields["preferences.terms.roche_terms_of_service"] = { isVisible: true };
// cindi-registration-screen2
cindi.fields["cindi-registration-screen2"]["jobPurposeStatementLabel"] = {
  isVisible: true,
};
cindi.fields["cindi-registration-screen2"]["aoiPurposeStatementLabel"] = {
  isVisible: true,
};
cindi.fields["data.c_profession.professionTypeDescription"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_profession.professionalId"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_profession.specialtyDescription"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.jobRoleDescription"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["areasOfInterest"] = { isVisible: true };
// cindi-registration-screen2 - HCOSearch
cindi.fields["data.c_personalAddress.country-screen2"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.city-screen2"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.isCustomAffiliation"] = { isVisible: true };
cindi.fields["data.c_affiliation.name"] = { isVisible: true, isRequired: true };
cindi.fields["data.c_affiliation.location"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.zipCode"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.state"] = {
  isVisible: true,
  isRequired: true,
};
cindi.fields["data.c_affiliation.stateDesc"] = {
  isVisible: true,
  isRequired: true,
};
// cindi-registration-screen3
cindi.fields["cindi-registration-screen3"]["communicationPreferencesHeader"] = {
  isVisible: true,
};
cindi.fields["cindi-registration-screen3"]["communicationPreferencesLabel"] = {
  isVisible: true,
};
cindi.fields["cindi-registration-screen3"]["emailDisclaimerLabel"] = {
  isVisible: true,
};
cindi.fields["cindi-registration-screen3"]["privacyNoticeLabel"] = {
  isVisible: true,
};
// gigya-verification-pending-screen
cindi.fields["gigya-verification-pending-screen"]["contactAffiliateLabel"] = {
  isVisible: true,
};
//cindi-update-professional-info
cindi.fields["cindi-update-professional-info"]["jobPurposeStatementLabel"] = {
  isVisible: true,
};
cindi.fields["cindi-update-professional-info"]["aoiPurposeStatementLabel"] = {
  isVisible: true,
};
// cindi-update-communication-preferences
cindi.fields["data.c_personalAddress.country-updateCommunicationPreferences"] =
  { isVisible: true, isRequired: true };
cindi.fields["cindi-update-communication-preferences"]["emailDisclaimerLabel"] =
  { isVisible: true };
cindi.fields["cindi-update-communication-preferences"][
  "privacyAndPreferencesHeader"
] = { isVisible: true };
cindi.fields["cindi-update-communication-preferences"]["youreInControlLabel"] =
  { isVisible: true };
cindi.fields["cindi-update-communication-preferences"][
  "communicationPreferencesHeader"
] = { isVisible: true };
cindi.fields["cindi-update-communication-preferences"]["ourGoalLabel"] = {
  isVisible: true,
};
cindi.fields["cindi-update-communication-preferences"][
  "communicationPreferencesHeader"
] = { isVisible: true };
cindi.fields["cindi-update-communication-preferences"][
  "communicationPreferencesLabel"
] = { isVisible: true };
cindi.fields["cindi-update-communication-preferences"]["privacyNoticeLabel"] = {
  isVisible: true,
};
// field controller profile update common settings
cindi.fields.searchAffiliation = { isVisible: true };
cindi.fields["data.c_rocheFlags.useDirectMailHCOAddress"] = { isVisible: true };
cindi.fields.blockProfileUpdateLabel = { isVisible: false };
cindi.fields.profileUpdateSaveButton = { isVisible: true };
