FROM ubuntu:21.10

ENV DENO_TARGET=x86_64-unknown-linux-gnu
ENV DENO_VERSION=v1.17.2

RUN apt-get -qq update \
 && apt-get upgrade -y -o Dpkg::Options::="--force-confold" \
 && apt-get -qq install -y ca-certificates curl unzip --no-install-recommends \
 && curl -fsSL https://github.com/denoland/deno/releases/download/${DENO_VERSION}/deno-${DENO_TARGET}.zip \
         --output deno.zip \
 && unzip deno.zip \
 && rm deno.zip \
 && chmod 755 deno \
 && mv deno /usr/bin/deno \
 && apt-get -qq remove -y ca-certificates curl unzip \
 && apt-get -y -qq autoremove \
 && apt-get -qq clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN useradd --uid 1993 --user-group deno \
 && mkdir /deno-dir/ \
 && chown deno:deno /deno-dir/

ENV DENO_DIR /deno-dir/
ENV DENO_INSTALL_ROOT /usr/local

COPY app/* /deno-dir/

WORKDIR /deno-dir/
RUN /bin/deno cache --reload --lock=lock.json deps.ts

ENTRYPOINT /bin/deno run --allow-net=0.0.0.0,$FUSION_DOWNSTREAM_HOST --allow-env=FUSION_PORT,FUSION_DOWNSTREAM_URL --cached-only service.ts
