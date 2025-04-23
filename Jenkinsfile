pipeline {
    agent any

    environment {
        NODE_ENV = 'development' // Don’t set to production to allow dev deps
        NPM_TOKEN = credentials('ISHAAN_NPM_TOKEN')
        SLACK_WEBHOOK = credentials('SLACK_JS_CHANNEL_URL')
        REPO = 'LikeMindsCommunity/likeminds-feed-reactjs'
    }

    tools {
        nodejs 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check git tags') {
            steps {
                dir('core') {
                    script {
                        // Fetch all tags from the remote repository
                        sh 'git fetch --tags'

                        // Get the previous version from the last release tag
                        def previous_version = sh(script: 'git describe --tags --abbrev=0', returnStdout: true).trim()

                        // Get the current version from package.json
                        def current_version = sh(script: "cat package.json | grep '\"version\":' | awk -F'\"' '{print \$4}'", returnStdout: true).trim()

                        echo "previous version ${previous_version}, current version ${current_version}"

                        // Compare versions
                        if (previous_version != "v${current_version}") {
                            echo "Version has changed from ${previous_version} to v${current_version}."
                        } else {
                            echo 'Version has not changed.'
                            error "Stopping the pipeline as the version hasn't changed."
                        }
                    }
                }
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

                        // Set Git identity and create tag
                        sh """
            git config user.name 'Ishaan Jain'
            git config user.email 'ishaan.jain@likeminds.community'
            git tag ${tagName}
        """

                        // Create GitHub release and push tag using secure token
                        withCredentials([string(credentialsId: 'ISHAAN_NPM_TOKEN', variable: 'GITHUB_TOKEN')]) {
                            // Set remote with token (only in CI scope)
                            sh '''
            git remote set-url origin https://$GITHUB_TOKEN@github.com/LikeMindsCommunity/likeminds-feed-reactjs.git
            git push origin ${tagName}
            '''.stripIndent()

                            // Write release payload to a file
                            def releasePayload = """
            {
                "tag_name": "${tagName}",
                "name": "${releaseName}",
                "generate_release_notes": true,
                "draft": false,
                "prerelease": false
            }
            """
                            writeFile file: 'release_payload.json', text: releasePayload

                            // Hit GitHub release API securely
                            sh '''
                curl -X POST https://api.github.com/repos/LikeMindsCommunity/likeminds-feed-reactjs/releases \
                -H "Authorization: token $GITHUB_TOKEN" \
                -H "Content-Type: application/json" \
                -d @release_payload.json
            '''
                        }

                        // Save version for Slack or other stages
                        currentBuild.description = tagName
                    }
                }
            }
        }

        stage('Notify Slack') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_JS_CHANNEL_URL', variable: 'SLACK_WEBHOOK')]) {
                    script {
                        def version = sh(script: "node -p \"require('./core/package.json').version\"", returnStdout: true).trim()
                        def branch = env.GIT_BRANCH ?: 'unknown'
                        def buildNumber = env.BUILD_NUMBER
                        def jobName = env.JOB_NAME
                        def timestamp = (System.currentTimeMillis() / 1000)

                        def slackPayload = """
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
                    { "title": "Build", "value": "#${buildNumber}", "short": true },
                    { "title": "Job Name", "value": "${jobName}", "short": true }
                ],
                "footer": "Jenkins CI",
                "footer_icon": "https://jenkins.io/images/logos/jenkins/jenkins.png",
                "ts": ${timestamp}
                }
            ]
            }
        """

                        writeFile file: 'slack_payload.json', text: slackPayload

                        sh '''
            curl -X POST -H "Content-Type: application/json" \
            --data @slack_payload.json $SLACK_WEBHOOK
            '''
                    }
                }
            }
        }
    }
}
