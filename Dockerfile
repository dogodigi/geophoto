FROM node:8

# Create geophoto directory
RUN mkdir /geophoto
WORKDIR /geophoto

# Variables
ENV NODE_ENV production
ENV FLICKR_API_KEY yourflickrapikey
ENV FLICKR_SECRET yourflickrsecret
ENV FLICKR_USER_ID yourflickruserid
ENV FLICKR_ACCESS_TOKEN yourflickraccesstoken
ENV FLICKR_ACCESS_TOKEN_SECRET yourflickraccesstokensecret

# Install
COPY . /geophoto

RUN npm install .

COPY config-docker.json /geophoto/config/config.json

COPY start.sh /start.sh
RUN chmod 755 /*.sh
EXPOSE 8080
CMD ["/start.sh"]
