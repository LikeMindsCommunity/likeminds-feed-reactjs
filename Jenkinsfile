pipeline {
    agent any

    environment {
        NPM_TOKEN = credentials('NPM_TOKEN')
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        SLACK_WEBHOOK = credentials('SLACK_WEBHOOK_URL')
        REPO = 'https://github.com/LikeMindsCommunity/likeminds-feed-reactjs'  // 🔁 Replace with your actual repo
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
                        sh "git config user.email 'ci@yourdomain.com'"
                        sh "git tag ${tagName}"
                        sh "git push origin ${tagName}"

                        sh """
                curl -X POST https://api.github.com/repos/${env.REPO}/releases \\
                    -H "Authorization: token ${env.GITHUB_TOKEN}" \\
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
                }
            }
        }
    }

    post {
        success {
            script {
                def version = sh(script: "node -p \"require('./core/package.json').version\"", returnStdout: true).trim()
                def tagName = "v${version}"
                def buildNumber = env.BUILD_NUMBER
                def jobName = env.JOB_NAME
                def branch = env.GIT_BRANCH ?: 'master' // fallback if not set
                def repo = env.REPO

                def slackMessage = """
            {
                "attachments": [
                {
                    "color": "#36a64f",
                    "title": "✅ ReactJS SDK Deployed!",
                    "text": "A new version of the SDK was deployed successfully to npm and GitHub.",
                    "fields": [
                    { "title": "Version", "value": "${tagName}", "short": true },
                    { "title": "Branch", "value": "${branch}", "short": true },
                    { "title": "Build", "value": "#${buildNumber}", "short": true },
                    { "title": "Job", "value": "${jobName}", "short": true }
                    ],
                    "footer": "Jenkins CI · GitHub · npm",
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
                echo '✅ Fancy Slack notification sent.'
            }
        }
        failure {
            echo '💥 Pipeline failed. Slack message skipped.'
        }
    }
}
