import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'

const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

const requiredInProductionIf = (condition: boolean) => ({ requireInProduction: condition })

const auditConfig = () => {
  const auditEnabled = get('AUDIT_ENABLED', 'false') === 'true'
  return {
    enabled: auditEnabled,
    queueUrl: get(
      'AUDIT_SQS_QUEUE_URL',
      'http://localhost:4566/000000000000/mainQueue',
      requiredInProductionIf(auditEnabled),
    ),
    serviceName: get('AUDIT_SERVICE_NAME', 'UNASSIGNED', requiredInProductionIf(auditEnabled)),
    region: get('AUDIT_SQS_REGION', 'eu-west-2'),
  }
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: process.env.NO_HTTPS === 'true' ? false : production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      authClientId: get('AUTH_CODE_CLIENT_ID', 'clientid', requiredInProduction),
      authClientSecret: get('AUTH_CODE_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('CLIENT_CREDS_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('CLIENT_CREDS_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    launchpadAuth: {
      url: get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('LAUNCHPAD_AUTH_EXTERNAL_URL', get('LAUNCHPAD_AUTH_URL', 'http://localhost:8080')),
      timeout: {
        response: Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('LAUNCHPAD_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      refreshCheckTimeInMinutes: Number(get('REFRESH_CHECK_TIMEOUT_IN_MINUTES', 5)),
      agent: new AgentConfig(Number(get('LAUNCHPAD_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('LAUNCHPAD_API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('LAUNCHPAD_API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      scopes: [
        {
          type: 'user.basic.read',
          accessGranted: 'Grants permission to read basic user information like firstName and lastName.',
          permittedImplicitly: true,
          humanReadableDescription: 'Your name',
        },
        {
          type: 'user.establishment.read',
          accessGranted: 'Grants permission to read details about the establishment or prison the user is located.',
          permittedImplicitly: false,
          humanReadableDescription: 'Details of your prison',
        },
        {
          type: 'user.booking.read',
          accessGranted: 'Grants permission to read the booking details of the user.',
          permittedImplicitly: false,
          humanReadableDescription: 'Prison booking details',
        },
      ],
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    exampleApi: {
      url: get('EXAMPLE_API_URL', 'http://localhost:8080', requiredInProduction),
      healthPath: '/health/ping',
      timeout: {
        response: Number(get('EXAMPLE_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('EXAMPLE_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('EXAMPLE_API_TIMEOUT_RESPONSE', 5000))),
    },
    cmsApi: {
      url: get('CMS_API_URL', 'http://localhost:8888', requiredInProduction),
      healthPath: '/jsonapi',
      timeout: {
        response: Number(get('CMS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('CMS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('CMS_API_TIMEOUT_RESPONSE', 5000))),
    },
  },
  establishments: [
    { code: 'BNI', name: 'bullingdon', displayName: 'HMP Bullingdon', youth: false },
    { code: 'BWI', name: 'berwyn', displayName: 'HMP Berwyn', youth: false },
    { code: 'CDI', name: 'chelmsford', displayName: 'HMP Chelmsford', youth: false },
    { code: 'CFI', name: 'cardiff', displayName: 'HMP Cardiff', youth: false },
    { code: 'CKI', name: 'cookhamwood', displayName: 'HMP Cookham Wood', youth: false },
    { code: 'EEI', name: 'erlestoke', displayName: 'HMP Erlestoke', youth: false },
    { code: 'FMI', name: 'felthamb', displayName: 'HMYOI Feltham B', youth: true },
    { code: 'FYI', name: 'felthama', displayName: 'HMYOI Feltham A', youth: true },
    { code: 'GHI', name: 'garth', displayName: 'HMP Garth', youth: false },
    { code: 'LHI', name: 'lindholme', displayName: 'HMP Lindholme', youth: false },
    { code: 'MTI', name: 'themount', displayName: 'HMP The Mount', youth: false },
    { code: 'NHI', name: 'newhall', displayName: 'HMPYOI New Hall', youth: false },
    { code: 'RNI', name: 'ranby', displayName: 'HMP Ranby', youth: false },
    { code: 'SHI', name: 'stokeheath', displayName: 'HMPYOI Stoke Heath', youth: false },
    { code: 'SLI', name: 'swaleside', displayName: 'HMP Swaleside', youth: false },
    { code: 'STI', name: 'styal', displayName: 'HMPYOI Styal', youth: false },
    { code: 'WHI', name: 'woodhill', displayName: 'HMP Woodhill', youth: false },
    { code: 'WLI', name: 'wayland', displayName: 'HMP Wayland', youth: false },
    { code: 'WNI', name: 'werrington', displayName: 'HMYOI Werrington', youth: false },
    { code: 'WYI', name: 'wetherby', displayName: 'HMYOI Wetherby', youth: true },
  ],
  sqs: {
    audit: auditConfig(),
  },
  environmentName: get('ENVIRONMENT_NAME', ''),
}
