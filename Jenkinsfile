elifePipeline {
    def commit

    elifeOnNode(
        {
            stage 'Checkout', {
                checkout scm
                commit = elifeGitRevision()
            }

            stage 'Build images', {
                checkout scm
                sh "docker-compose build"
            }

            stage 'Project tests', {
                sh "./project_tests.sh"
            }
        },
        'containers--medium'
    )
}
