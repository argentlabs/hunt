def cloudfrontID(env) {
  if (env == "dev") {
    return 'E2TFIDMMWT5FKU'
  } else if (env == "test") {
    return 'E2TFIDMMWT5FKU'
  } else if (env == "staging") {
    return 'E2TFIDMMWT5FKU'
  }
  return 'E2TFIDMMWT5FKU'
}

pipeline {
     agent {
            dockerfile true
        }

    parameters {
        choice(name: 'WORKSPACE', choices: ['dev', 'test', 'staging'], description: 'Workspace stage')
    }

    environment {
        AWS_ACCOUNT_ID = credentials("aws-account-id-${params.WORKSPACE}")
        S3_BUCKET = "emojihunt"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                withAWS(region: 'eu-west-1', role:'Terraform', roleAccount: "${env.AWS_ACCOUNT_ID}") {
                    script {
                        sh "npm install"
                        sh "REACT_APP_ENV=${params.WORKSPACE} npm run build"

                        dir('./build') {
                            sh "aws s3 sync --acl public-read --sse --delete . s3://${S3_BUCKET}"
                        }

                        def distribution = cloudfrontID(params.WORKSPACE)
                        sh "aws cloudfront create-invalidation --distribution-id ${distribution} --paths '/*'"
                    }
                }
            }
        }
    }
}
