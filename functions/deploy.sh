#!/bin/bash

# Load environment variables
source .env.local

# Deploy to Google Cloud Functions
gcloud functions deploy contactFormHandler \
    --runtime=nodejs18 \
    --region=europe-west3 \
    --trigger-http \
    --allow-unauthenticated \
    --entry-point=contactFormHandler \
    --set-env-vars SENDGRID_API_KEY=$SENDGRID_API_KEY \
    --set-env-vars RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY
