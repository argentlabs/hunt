FROM node:alpine

ENV HOME=./app

RUN apk add --no-cache --virtual .build-deps gcc g++ make python git

RUN apk -v --update add \
        python \
        py-pip \
        groff \
        less \
        mailcap \
        && \
    pip install --upgrade pip && \
    pip install awscli --upgrade && \
    apk -v --purge del py-pip && \
    rm /var/cache/apk/*
