FROM registry.access.redhat.com/ubi9/nodejs-20-minimal AS repo-builder

USER root
RUN INSTALL_PKGS="git rsync" && \
    microdnf --nodocs --setopt=install_weak_deps=0 install -y $INSTALL_PKGS && \
    microdnf clean all && \
    rm -rf /mnt/rootfs/var/cache/* /mnt/rootfs/var/log/dnf* /mnt/rootfs/var/log/yum.*
USER 1001

FROM repo-builder AS devcontainer
ENV NODE_OPTIONS='--max-old-space-size=8192'
ENV CI='true'
COPY --chown=1001:0 / "${APP_ROOT}/src/repo"
RUN npm install -g corepack && corepack enable
WORKDIR "${APP_ROOT}/src/repo"
RUN yarn install --immutable && yarn all:build

FROM registry.access.redhat.com/ubi8/nginx-122 AS migration-planner
EXPOSE 8080
COPY --from=devcontainer /opt/app-root/src/repo/apps/demo/dist/ "${NGINX_APP_ROOT}/src/"
COPY --from=devcontainer /opt/app-root/src/repo/deploy/ /deploy/
CMD [ "/deploy/start.sh" ]
