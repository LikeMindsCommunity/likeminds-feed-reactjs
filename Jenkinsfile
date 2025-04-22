pipeline {
    agent any

    environment {
        NODE_ENV = 'development' // Don’t set to production to allow dev deps
        NPM_TOKEN = credentials('NPM_TOKEN')
        SLACK_WEBHOOK = credentials('SLACK_WEBHOOK_URL')
        REPO = 'LikeMindsCommunity/likeminds-feed-reactjs'
    }

    tools {
        nodejs 'Node_18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build SDK') {
            steps {
                dir('core') {
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm run build-lib'
                }
            }
        }

        stage('Publish to npm') {
            steps {
                dir('core') {
                    sh 'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc'
                    sh 'npm publish'
                }
            }
        }

        stage('Tag & GitHub Release') {
            steps {
                dir('core') {
                    script {
                        def version = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                        def tagName = "v${version}"
                        def releaseName = "Release ${version}"

                        sh "git config user.name 'CI Bot'"
                        sh "git config user.email 'ci@likeminds.community'"
                        sh "git tag ${tagName}"
                        sh "git push origin ${tagName}"

                        // Securely call GitHub API using credentials block
                        withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
                            sh """
                curl -s -X POST https://api.github.com/repos/${REPO}/releases \\
                -H "Authorization: token \$GITHUB_TOKEN" \\
                -H "Content-Type: application/json" \\
                -d '{
                  "tag_name": "${tagName}",
                  "name": "${releaseName}",
                  "body": "Automated release from Jenkins.",
                  "draft": false,
                  "prerelease": false
                }'
              """
                        }

                        // Save version for Slack use
                        currentBuild.description = tagName
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def version = currentBuild.description ?: 'v?'
                def branch = env.GIT_BRANCH ?: 'custom'
                def buildNumber = env.BUILD_NUMBER
                def jobName = env.JOB_NAME

                def slackMessage = """
        {
          "attachments": [
            {
              "color": "#36a64f",
              "title": "✅ ReactJS SDK Deployed",
              "title_link": "https://github.com/${REPO}/releases/tag/${version}",
              "text": "A new version of the React SDK has been deployed and released.",
              "fields": [
                { "title": "Version", "value": "${version}", "short": true },
                { "title": "Branch", "value": "${branch}", "short": true },
                { "title": "Build", "value": "#${buildNumber}", "short": true }
              ],
              "footer": "Jenkins CI",
              "footer_icon": "https://jenkins.io/images/logos/jenkins/jenkins.png",
              "ts": ${System.currentTimeMillis() / 1000}
            }
          ]
        }
        """
                sh """
          curl -X POST -H 'Content-type: application/json' \
          --data '${slackMessage}' ${SLACK_WEBHOOK}
        """
            }
        }

        failure {
            echo '💥 Pipeline failed. No release or Slack message.'
        }
    }
}
