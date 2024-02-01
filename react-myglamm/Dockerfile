FROM atlassian/pipelines-awscli as uploader
ARG ROOT
ENV ROOT=$ROOT
COPY build/$ROOT/.next/static ./build/.next/static
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG BUCKET_PATH
ARG AWS_S3_COPY=False
ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_SAS_TOKEN
ARG AKS_Blob_COPY
RUN if [ "$AWS_S3_COPY" = "True" ] ; then AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY aws s3 cp build/.next/static s3://$BUCKET_PATH/ --recursive; fi

FROM public.ecr.aws/g1m8z0n3/azure-cli:latest as uploader-azure
ARG ROOT
ENV ROOT=$ROOT
COPY build/$ROOT/.next/static ./build/.next/static
ARG BUCKET_PATH
ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_SAS_TOKEN
ARG AKS_Blob_COPY
RUN if [ "$AKS_Blob_COPY" = "True" ] ; then echo "Blob copy started"; az storage azcopy blob upload -c $BUCKET_PATH --account-name $AZURE_STORAGE_ACCOUNT -s "build/.next/static/*" --recursive  --sas-token "$AZURE_STORAGE_SAS_TOKEN"; fi



FROM node:20-alpine as starter
WORKDIR /standalone
ARG ROOT
ENV ROOT=$ROOT
EXPOSE 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY build/$ROOT/.next/standalone ./
CMD node apps/$ROOT/server.js
