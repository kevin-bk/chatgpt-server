FROM thwint/chromium-browser:109

LABEL maintainer="phitruong.2knd@gmail.com"

USER root

RUN apk add --no-cache wget curl zip unzip sudo  \
    && apk add --no-cache git nano ca-certificates \
    && apk add --update nodejs npm \
    && npm install pm2 eslint -g \
    && npm --force install -g yarn \
    && rm -rf /var/lib/apt/lists/* /var/tmp/* /usr/share/doc/* tmp/* /var/log/lastlog /var/log/faillog

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY docker-custom-entrypoint.sh /docker-custom-entrypoint.sh
RUN chmod +x /docker-custom-entrypoint.sh
ENTRYPOINT ["/docker-custom-entrypoint.sh"]
