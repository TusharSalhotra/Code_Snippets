import gql from 'graphql-tag';

/************************************************
  USER
 ************************************************/

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      _id
      email
      phoneNumber
      firstName
      organizationContextId
      currentOrganizationRole
      lastName
      couponIds
      visitIds
    }
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation updateUserInfo(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
  ) {
    updateUserInfo(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
    ) {
      _id
      email
      phoneNumber
      firstName
      organizationContextId
      currentOrganizationRole
      lastName
      couponIds
      visitIds
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $password: String!
  ) {
    register(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      password: $password
    ) {
      token
    }
  }
`;

export const PASSWORD_LOGIN = gql`
  mutation passwordLogin($email: String!, $password: String!) {
    passwordLogin(email: $email, password: $password) {
      token
    }
  }
`;

export const PASSWORD_FORGOT = gql`
  mutation passwordForgot($email: String!) {
    passwordForgot(email: $email) {
      message
    }
  }
`;

export const PASSWORD_RESET = gql`
  mutation passwordReset($password: String!, $code: String!) {
    passwordReset(password: $password, code: $code) {
      message
      status
    }
  }
`;

export const PHONE_LOGIN = gql`
  mutation phoneLogin($email: String!, $phoneNumber: String!) {
    phoneLogin(email: $email, phoneNumber: $PhoneNumber) {
      token
    }
  }
`;

/************************************************
  ORGANIZATION
 ************************************************/

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization(
    $name: String!
    $address: AddressInput
    $logoUrl: String!
    $posterImageUrl: String!
    $timezoneId: String!
  ) {
    createOrganization(
      name: $name
      address: $address
      logoUrl: $logoUrl
      posterImageUrl: $posterImageUrl
      timezoneId: $timezoneId
    ) {
      token
    }
  }
`;

export const GET_CURRENT_ORGANIZATION = gql`
  query getCurrentOrganization {
    getCurrentOrganization {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      base64_logoUrl
      base64_posterImageUrl
      activeSubscriber
      subscriptionId
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        welcomeMessage
        websiteUrl
        reservationUrl
      }
      keyword
      phrase
      phoneNumber
      mmsEnabled
      timezone {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
      campaignPhoneNumber
    }
  }
`;

export const UPDATE_ORGANIZATION_INFO = gql`
  mutation updateOrganizationInfo(
    $name: String!
    $address: AddressInput
    $logoUrl: String!
    $posterImageUrl: String!
    $timezoneId: String
  ) {
    updateOrganizationInfo(
      name: $name
      address: $address
      logoUrl: $logoUrl
      timezoneId: $timezoneId
      posterImageUrl: $posterImageUrl
    ) {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      subscriptionId
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
      keyword
      phrase
      phoneNumber
      timezone {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_SELF_OPT_IN = gql`
  mutation updateOrganizationSelfOptIn($keyword: String!, $phrase: String!) {
    updateOrganizationSelfOptIn(keyword: $keyword, phrase: $phrase) {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      subscriptionId
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
      keyword
      phrase
      phoneNumber
      timezone {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_CONFIGURATION = gql`
  mutation updateOrganizationConfiguration(
    $configurations: OrganizationConfigurationsInput!
  ) {
    updateOrganizationConfiguration(configurations: $configurations) {
      _id
      name
      createdAt
      logoUrl
      posterImageUrl
      activeSubscriber
      subscriptionId
      address {
        address1
        address2
        city
        state
        zip
        country
      }
      configurations {
        affiliateCredit
        firstTimeRecipientCredit
        repeatRecipientCredit
        returnLimit
        couponActivationExpiration
        couponRedemptionExpiration
        websiteUrl
        reservationUrl
        welcomeMessage
      }
      keyword
      phrase
      phoneNumber
      timezone {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
    }
  }
`;

export const GET_ALL_ORGANIZATIONS = gql`
  query getAllOrganizations {
    getAllOrganizations {
      _id
      name
      createdAt
      ltv
      upcomingRevenue
      cycleStartAt
      cycleEndAt
      campaignPhoneNumber
      phoneNumber
      mmsEnabled
    }
  }
`;

export const SET_ORG_CONTEXT_ID = gql`
  mutation setOrganizationContextId($organizationId: String!) {
    setOrganizationContextId(organizationId: $organizationId) {
      token
    }
  }
`;

/************************************************
  ROLES
 ************************************************/

export const GET_ORGANIZATION_ROLES = gql`
  query getOrganizaationRoles {
    getOrganizationRoles {
      _id
      userId
      phoneNumber
      organizationId
      acceptedAt
      accessLevel
      user {
        firstName
        lastName
        email
        phoneNumber
      }
    }
  }
`;

export const GET_USER_ROLES = gql`
  query getUserRoles {
    getUserRoles {
      _id
      userId
      phoneNumber
      organizationId
      acceptedAt
      accessLevel
      user {
        firstName
        lastName
        email
        phoneNumber
      }
      organization {
        name
        logoUrl
      }
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation createRole($phoneNumber: String!, $accessLevel: String!) {
    createRole(phoneNumber: $phoneNumber, accessLevel: $accessLevel) {
      _id
      userId
      phoneNumber
      organizationId
      acceptedAt
      accessLevel
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation deleteRole($roleId: String!) {
    deleteRole(roleId: $roleId)
  }
`;

export const ACCEPT_ROLE = gql`
  mutation acceptRole(
    $roleId: String!
    $doesAccept: Boolean!
    $phoneCode: String!
  ) {
    acceptRole(
      roleId: $roleId
      doesAccept: $doesAccept
      phoneCode: $phoneCode
    ) {
      token
    }
  }
`;

/************************************************
  CONTACT
 ************************************************/

export const CREATE_CONTACTS = gql`
  mutation createContacts($phoneNumber: [String]!) {
    createContacts(phoneNumber: $phoneNumber)
  }
`;

export const GET_CONTACTS = gql`
  query getContacts(
    $query: ContactQueryInput
    $pagination: PaginationInput
    $ordering: OrderingInput
  ) {
    getContacts(query: $query, pagination: $pagination, ordering: $ordering) {
      _id
      phoneNumber
      organizationId
      createdAt
      lastImported
      attendedOrganization
      welcomed
      currentAvailableBalance
      originalSource
      optInMethod
      lastOptIn
      optOut
      totalCreditGranted
      totalCreditRedeemed
      totalCouponsGranted
      totalCouponsRedeemed
      totalCouponsAcceptedRef
      totalCouponsRedRef
      totalConversionRateRef
      smsCampaignOptOut
    }
  }
`;

export const GET_SUPERADMIN_FILTERS_DATA = gql`
  query getSuperAdminFiltersData {
    getSuperAdminFiltersData {
      organizations {
        _id
        name
      }
    }
  }
`;

export const GET_SUPERADMIN_CONTACTS = gql`
  query getSuperAdminContacts($query: SuperAdminContactsInput) {
    getSuperAdminContacts(query: $query) {
      _id
      phoneNumber
      organizationName
      organizationId
      createdAt
      lastImported
      attendedOrganization
      welcomed
      currentAvailableBalance
      originalSource
      optInMethod
      lastOptIn
      optOut
      totalCreditGranted
      totalCreditRedeemed
      totalCouponsGranted
      totalCouponsRedeemed
      totalCouponsAcceptedRef
      totalCouponsRedRef
      totalConversionRateRef
      smsCampaignOptOut
    }
  }
`;

/************************************************
  Message
 ************************************************/

export const SEND_CUSTOM_TEXT = gql`
  mutation sendCustomText(
    $phoneNumber: String!
    $message: String!
    $mediaUrl: String
    $organizationId: String
  ) {
    sendCustomText(
      phoneNumber: $phoneNumber
      message: $message
      mediaUrl: $mediaUrl
      organizationId: $organizationId
    )
  }
`;

export const SEND_WELCOME_TEXT = gql`
  mutation sendWelcomeText($phoneNumbers: [String]) {
    sendWelcomeText(phoneNumbers: $phoneNumbers)
  }
`;

/************************************************
  Coupon
 ************************************************/

export const GET_COUPON_BALANCE_TO_REDEEM = gql`
  query getCouponBalanceToRedeem($phoneNumber: String!) {
    getCouponBalanceToRedeem(phoneNumber: $phoneNumber)
  }
`;

export const GET_ACTIVE_COUPONS = gql`
  query getActiveCoupons($phoneNumber: String!) {
    getActiveCoupons(phoneNumber: $phoneNumber) {
      _id
      amount
      redemptionExpiration
    }
  }
`;

export const REDEEM_COUPON = gql`
  mutation redeemCoupon($phoneNumber: String!) {
    redeemCoupon(phoneNumber: $phoneNumber)
  }
`;

export const REDEEM_SELECTED_COUPONS = gql`
  mutation redeemCoupons($coupons: [String]!, $phoneNumber: String!) {
    redeemCoupons(coupons: $coupons, phoneNumber: $phoneNumber)
  }
`;

export const GET_REFFERED_CONTACTS = gql`
  query getReferedContacts($phoneNumber: String!, $couponType: String, $organizationId: String) {
    getReferedContacts(phoneNumber: $phoneNumber, couponType: $couponType, organizationId: $organizationId) {
      _id
      phoneNumber
      organizationId
      createdAt
      lastImported
      attendedOrganization
      welcomed
      currentAvailableBalance
      originalSource
      optInMethod
      lastOptIn
      optOut
      totalCreditGranted
      totalCreditRedeemed
      totalCouponsGranted
      totalCouponsRedeemed
      totalCouponsAcceptedRef
      totalCouponsRedRef
      totalConversionRateRef
      smsCampaignOptOut
      organizationName
    }
  }
`;

export const GET_ORG_TOP_REFERERS = gql`
  query getOrgTopReferers {
    getOrgTopReferers {
      _id
      phoneNumber
      totalAccepted
      totalRedeemed
      conversionRate
      totalAmountAccepted
      totalAmountRedeemed
    }
  }
`;

/************************************************
  Metrics
 ************************************************/

export const GET_ORGANIZATION_METRICS = gql`
  query getOrganizationMetrics($start: Int!, $end: Int!) {
    getOrganizationMetrics(start: $start, end: $end) {
      couponsRedeemedTotal
      couponsRedeemedNew
      couponsRedeemedRepeat
      couponsRedeemedAffiliate
      couponsGrantedTotal
      couponsGrantedNew
      couponsGrantedRepeat
      couponsGrantedAffiliate
      creditRedeemedTotal
      creditRedeemedNew
      creditRedeemedRepeat
      creditRedeemedAffiliate
      creditGrantedTotal
      creditGrantedNew
      creditGrantedRepeat
      creditGrantedAffiliate
      contactsWelcomed
      couponsExpiredWithoutRedemption
    }
  }
`;

export const GET_USER_METRICS = gql`
  query getUserMetrics($phoneNumber: String!) {
    getUserMetrics(phoneNumber: $phoneNumber) {
      # coupon stats
      currentAvailableBalance
      totalCreditGranted
      totalCreditRedeemed
      totalCouponsGranted
      totalCouponsRedeemed
      # Referral stats
      totalCouponsAcceptedRef
      totalCouponsRedRef
      totalConversionRateRef
    }
  }
`;

export const GET_SUPERADMIN_METRICS = gql`
  query getSuperAdminMetric($start: Int!, $end: Int!) {
    getSuperAdminMetrics(start: $start, end: $end) {
      upcomingRevenue
      lifeTimeRevenue
      totalClients
      totalContacts
      totalCouponsRedeemed
      totalCouponsRedeemedNew
      totalCouponsRedeemedRepeat
      totalCouponsRedeemedAffiliate
      totalCreditRedeemed
      totalCreditRedeemedNew
      totalCreditRedeemedRepeat
      totalCreditRedeemedAffiliate
      totalCreditActivated
      totalCreditActivatedNew
      totalCreditActivatedRepeat
      totalCreditActivatedAffiliate
      totalCouponsActivated
      totalCouponsActivatedNew
      totalCouponsActivatedRepeat
      totalCouponsActivatedAffiliate
      totalContactsWelcomed
    }
  }
`;

/************************************************
  File Upload
 ************************************************/

export const UPLOAD_FILES = gql`
  mutation uploadFiles($files: [Upload!]!) {
    uploadFiles(files: $files) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

export const UPLOAD_ORG_FILES = gql`
  mutation uploadOrgFiles($files: [Upload!]!) {
    uploadOrgFiles(files: $files) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

/************************************************
  Payment
 ************************************************/

export const CREATE_STRIPE_CUSTOMER = gql`
  mutation createStripeCustomer($cardToken: String!) {
    createStripeCustomer(cardToken: $cardToken)
  }
`;

export const LIST_INVOICES = gql`
  query listInvoices {
    listInvoices {
      _id
      subscriptionId
      organizationId
      subscriptionCycleStartDate
      subscriptionCycleEndDate
      paidAt
      totalAmountDue
      newCustomerCost
      repeatCustomerCost
      affiliateCustomerCost
      newCustomerAmount
      repeatCustomerAmount
      affiliateCustomerAmount
      stripeChargeId
      creditCardProcessingFee
      description
      campaignCharges
      type
    }
  }
`;

export const GET_CURRENT_PAYMENT_INFO = gql`
  query getCurrentPaymentInfo {
    getCurrentPaymentInfo {
      brand
      last4
      expMonth
      expYear
    }
  }
`;

export const CHANGE_PAYMENT_METHOD = gql`
  mutation changePaymentMethod($cardToken: String!) {
    changePaymentMethod(cardToken: $cardToken)
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation cancelSubScription {
    cancelSubscription
  }
`;

export const GET_TIMEZONES = gql`
  query getTimezones {
    timezones: getTimezones {
      timezonesArray: timezones {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
      defaultTimezone {
        value: _id
        label: zoneName
        name
        offset
        dstOffset
      }
    }
  }
`;

/************************************************
  SMS Templates
 ************************************************/

export const GET_SMS_TEMPLATES = gql`
  query getCampaignTemplates {
    templates: getCampaignTemplates {
      _id
      text
    }
  }
`;

export const CREATE_SMS_TEMPLATE = gql`
  mutation createCampaignTemplate($text: String!) {
    createCampaignTemplate(text: $text) {
      _id
      text
    }
  }
`;

export const UPDATE_SMS_TEMPLATE = gql`
  mutation updateCampaignTemplate($campaignTemplateId: String, $text: String) {
    updateCampaignTemplate(
      campaignTemplateId: $campaignTemplateId
      text: $text
    ) {
      _id
      text
    }
  }
`;

export const DELETE_SMS_TEMPLATE = gql`
  mutation deleteCampaignTemplate($campaignTemplateId: String) {
    deleteCampaignTemplate(campaignTemplateId: $campaignTemplateId) {
      _id
      text
    }
  }
`;

/************************************************
  SMS Campaigns
 ************************************************/

export const ACTIVATE_SMS_CAMPAIGNS = gql`
  mutation {
    activateSmsCampaign {
      campaignPhoneNumber
    }
  }
`;

export const GET_CAMPAIGN_CONFIG = gql`
  query {
    getDataForCampaign {
     
      activeContacts: totalContacts
      mmsEnabled
    }
  }
`;

export const GET_SMS_CAMPAIGNS = gql`
  query {
    getCampaigns {
      _id
      name
      type
      text
      numberSent
      creditsUsed
      unsubscribeMessage
      status
      dateTime
      executionStatus
      optOuts
      sendMode
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation createCampaign(
    $name: String!
    $text: String!
    $unsubscribeMessage: String!
    $status: String!
    $imageUrl: String
    $type: String!
    $dateTime: String
    $referralOptInText: String!
    $referralOptIn: Boolean!
  ) {
    campaign: createCampaign(
      name: $name
      text: $text
      unsubscribeMessage: $unsubscribeMessage
      status: $status
      imageUrl: $imageUrl
      type: $type
      dateTime: $dateTime
      referralOptInText: $referralOptInText
      referralOptIn: $referralOptIn
    ) {
      _id
      name
      unsubscribeMessage
      text
      status
      creditsUsed
      imageUrl
      numberSent
      dateTime
      sendMode
      executionStatus
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query getCampaignById($campaignId: String!) {
    campaign: getCampaignById(campaignId: $campaignId) {
      _id
      name
      unsubscribeMessage
      text
      type
      status
      creditsUsed
      imageUrl
      numberSent
      dateTime
      executionStatus
      optOuts
      sendMode
      referralOptInText
      referralOptIn
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation updateCampaign(
    $campaignId: String!
    $name: String!
    $text: String!
    $unsubscribeMessage: String!
    $status: String!
    $imageUrl: String
    $type: String!
    $dateTime: String
    $referralOptInText: String!
    $referralOptIn: Boolean!
  ) {
    campaign: updateCampaign(
      campaignId: $campaignId
      name: $name
      text: $text
      unsubscribeMessage: $unsubscribeMessage
      status: $status
      imageUrl: $imageUrl
      type: $type
      dateTime: $dateTime
      referralOptInText: $referralOptInText
      referralOptIn: $referralOptIn
    ) {
      _id
      name
      unsubscribeMessage
      text
      status
      creditsUsed
      imageUrl
      numberSent
      dateTime
      sendMode
      executionStatus
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation deleteCampign($campaignId: String!) {
    deleteCampaign(campaignId: $campaignId) {
      _id
    }
  }
`;

export const TEST_CAMPAIGN = gql`
  mutation testCampaign(
    $name: String!
    $text: String!
    $unsubscribeMessage: String!
    $status: String!
    $imageUrl: String
    $type: String!
    $dateTime: String
    $referralOptInText: String!
    $referralOptIn: Boolean!
    $customNumbers: [String]
  ) {
    campaign: testCampaign(
      name: $name
      text: $text
      unsubscribeMessage: $unsubscribeMessage
      status: $status
      imageUrl: $imageUrl
      type: $type
      dateTime: $dateTime
      referralOptInText: $referralOptInText
      referralOptIn: $referralOptIn
      customNumbers: $customNumbers
    ) {
      message
      success
    }
  }
`;

export const SET_MMS_ENABLED = gql`
  mutation updateMMSActivation($organizationId: String!, $mmsEnabled: String!) {
    updateMMSActivation(
      organizationId: $organizationId
      mmsEnabled: $mmsEnabled
    ) {
      _id
    }
  }
`;
