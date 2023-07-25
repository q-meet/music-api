FROM meetdocker2020/node_base:latest

#镜像的工作目录
WORKDIR /app 
#把我本地的文件拷贝到镜像/app目录下
COPY ./NeteaseCloudMusicApi ./NeteaseCloudMusicApi 
COPY ./QQMusicApi ./QQMusicApi
COPY ./MiguMusicApi ./MiguMusicApi
COPY ./tonzhon-music ./tonzhon-music

#启动各个音乐api的脚本也要拷贝过去
COPY ./run.sh .  

ENV QQ 1040927107 
#qq音乐的环境变量：qq号，如果外部有配置-e QQ的环境变量，这里将被覆盖

#赋予脚本可执行权限
RUN chmod +x ./run.sh 

#容器启动时执行的命令，这里是执行 run.sh
ENTRYPOINT sh ./run.sh $QQ 
#暴露端口给宿主机
EXPOSE 3000
EXPOSE 3300
EXPOSE 3400
EXPOSE 8081