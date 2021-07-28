command to zip up a function

    zip -r function.zip index.js node_modules

command to zip up the working function

    AWS_ACCESS_KEY_ID=REPLACE_WITH_ACCESS_KEY AWS_SECRET_ACCESS_KEY=REPLACE_WITH_ACCESS_SECRET  aws lambda update-function-code --function-name july-2021-delete-after-july-31 --zip-file fileb://function.zip --region us-west-2


commands to update env vars

    AWS_ACCESS_KEY_ID=REPLACE_WITH_ACCESS_KEY AWS_SECRET_ACCESS_KEY=REPLACE_WITH_ACCESS_SECRET  aws lambda update-function-configuration --environment '{"Variables":{"foo":"bar"}}'

    AWS_ACCESS_KEY_ID=REPLACE_WITH_ACCESS_KEY AWS_SECRET_ACCESS_KEY=REPLACE_WITH_ACCESS_SECRET aws lambda update-function-configuration --function-name july-2021-delete-after-july-31 --environment '{"Variables":{"ELASTIC_APM_CENTRAL_CONFIG":"false","ELASTIC_APM_CLOUD_PROVIDER":"none","ELASTIC_APM_LOG_LEVEL":"trace","ELASTIC_APM_SERVICE_NAME":"Working Lambda","ELASTIC_APM_SECRET_TOKEN":"DljDqIApWF7EMjS8ta","ELASTIC_APM_SERVER_URL":"https://01cd7a0a66084992906782275a699198.apm.us-east-1.aws.cloud.es.io:443"}}' --region us-west-2

command to invoke working function

    AWS_ACCESS_KEY_ID=REPLACE_WITH_ACCESS_KEY AWS_SECRET_ACCESS_KEY=REPLACE_WITH_ACCESS_SECRET aws lambda invoke --function-name july-2021-delete-after-july-31 --region us-west-2 /tmp/out.txt

command to publish layer

    AWS_ACCESS_KEY_ID=REPLACE_WITH_ACCESS_KEY AWS_SECRET_ACCESS_KEY=REPLACE_WITH_ACCESS_SECRET aws lambda publish-layer-version \
 --layer-name "go-example-extension" \
 --region us-west-2 \
 --zip-file  "fileb://extension.zip"
