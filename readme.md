# 文章目录

认识Docker  
Docker是什么  
Docker的用途  
镜像创建  
音乐接口api制作  
一起听歌吧主程序镜像制作  
使用docker-compose一键启动项目  
docker其他常用命令  
总结  
创建Springboot+Redis+NodeJs项目的Docker镜像  
2020-10-08 / 12 min read  
考虑到应用一起听歌吧 开源地址：[https://github.com/JumpAlang/Jusic-Serve-Houses](https://github.com/JumpAlang/Jusic-Serve-Houses)
后期可能要迁移服务器，也为了方便一起听歌吧的小伙伴在自己的服务器部署，制作一起听歌吧Docker镜像刻不容缓。

```text
认识Docker
以下内容摘抄自阮一峰博客Docker 入门教程，建议之前没有使用过docker的小伙伴先看下，我也是看这篇入门的。

2013年发布至今， Docker 一直广受瞩目，被认为可能会改变软件行业。
软件开发最大的麻烦事之一，就是环境配置。用户计算机的环境都不相同，你怎么知道自家的软件，能在那些机器跑起来？

用户必须保证两件事：操作系统的设置，各种库和组件的安装。只有它们都正确，软件才能运行。举例来说，安装一个 Python 应用，计算机必须有 Python 引擎，还必须有各种依赖，可能还要配置环境变量。

如果某些老旧的模块与当前环境不兼容，那就麻烦了。开发者常常会说："它在我的机器可以跑了"（It works on my machine），言下之意就是，其他机器很可能跑不了。

环境配置如此麻烦，换一台机器，就要重来一次，旷日费时。很多人想到，能不能从根本上解决问题，软件可以带环境安装？也就是说，安装的时候，把原始环境一模一样地复制过来

Docker是什么
Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案。

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

总体来说，Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

Docker的用途
Docker 的主要用途，目前有三大类。

（1）提供一次性的环境。比如，本地测试他人的软件、持续集成的时候提供单元测试和构建的环境。

（2）提供弹性的云服务。因为 Docker 容器可以随开随关，很适合动态扩容和缩容。

（3）组建微服务架构。通过多个容器，一台机器可以跑多个服务，因此在本机就可以模拟出微服务架构。

镜像创建
一起听歌吧项目主要可以拆分成三个镜像：

音乐接口api 一起听歌吧的音乐资源，包括网易、QQ、咪咕、铜钟（主要从酷我虾米找寻音乐），基础镜像：NodeJs
Redis 一起听歌吧的数据服务，基础镜像：Redis
一起听歌吧主程序 一起听歌吧的业务逻辑，依赖前面两个镜像，基础镜像：Java
音乐接口api制作
准备
把各个已经编译且可运行的音乐api代码（包括node_modules）拷贝到统一一个文件夹，方便进行shell操作。
编写Dockerfile
之前看到一篇博客：nodejs 应用打包docker创建精简1G多镜像，说NodeJs镜像很大,于是按照文章教程在本地制作了一个NodeJs基础镜像node_base
FROM node_base:latest #精简的NodeJs基础镜像，上文有说到

WORKDIR /app  #镜像的工作目录
COPY ./NeteaseCloudMusicApi ./NeteaseCloudMusicApi #把我本地的文件拷贝到镜像/app目录下
COPY ./QQMusicApi ./QQMusicApi
COPY ./MiguMusicApi ./MiguMusicApi
COPY ./tongzhongForJusic ./tongzhongForJusic

COPY ./entrypoint.sh .  #启动各个音乐api的脚本也要拷贝过去
RUN chmod +x ./entrypoint.sh #赋予脚本可执行权限

ENV QQ 1040927107  #qq音乐的环境变量：qq号，如果外部有配置-e QQ的环境变量，这里将被覆盖

ENTRYPOINT sh ./entrypoint.sh $QQ  #容器启动时执行的命令，这里是执行entrypoint.sh
EXPOSE 3000  #暴露端口给宿主机
EXPOSE 3300
EXPOSE 3400
EXPOSE 8081
编写entrypoint.sh 脚本
#!/bin/bash
cd ./NeteaseCloudMusicApi #跳转容器相应目录
nohup node app.js &  #执行启动音乐api命令，nohup指在后台运行
cd ../MiguMusicApi
nohup npm start &
cd ../tongzhongForJusic
nohup npm run server &
cd ../QQMusicApi
PORT=3300 QQ=$1 npm start  #$1,是指执行命令传递过来的第二个参数，第一个参数是entrypoint.sh，第二个参数是qq号
#记得这里不能加nohup让程序在后台运行，因为如果所有应用都在后台运行，docker会自动把这个容器给关闭了。
在windows下编写的脚本，回车可能导致在linux运行不了，建议在linux下编写脚本完拷贝过来

创建镜像
docker image build -t jusic_music_api:1.0 .

本地运行测试
docker run --name jusic_music_api -e QQ=1040927107 -p 3000:3000 -p 3300:3300 -p 3400:3400 -p 8081:8081 -d jusic_music_api:1.0
运行后执行docker ps查看容器是否运行或者访问任一音乐api（如浏览器不能访问：localhost:3000，则说明没启动成功，可以使用docker命令查看日记：docker logs jusic_music_api，或者在entrypoint.sh添加一些辅助日记，如echo pwd > test.txt）,
进入容器内部执行命令：docker exec -it jusic_music_api sh。

发布镜像
如果测试一切运行正常，那就可以把镜像发布至docker官方。
一. 登录
docker login
二. 为本地的 image 标注用户名和版本
docker image tag jusic_music_api:1.0 jumpalang/jusic_music_api:1.0
三. 发布镜像
docker image push jumpalang/jusic_music_api:1.0
四. 完善镜像详细信息
访问官方镜像网站http://hub.docker.com，填写镜像的描述信息及详细信息

一起听歌吧主程序镜像制作
准备
一. 为了不额外的部署前端页面，把前端页面放到后端的resources/static目录下。并在security模块放开相应静态资源路径。
二. 把application.yml的系统相关配置参数化，方便通过环境变量直接配置，如房间数house_size: ${HouseSize:32},如果没设置环境变量默认就是32，如果运行容器时有设置-e HouseSize=64,则房间数变为64。
编写Dockerfile

```

```dockerfile
FROM java:8
EXPOSE 8888
WORKDIR /app
ADD target/jusic-serve.jar ./jusic-serve.jar

ENV APIUSER=admin APIPWD=123456 RedisHost=redis MusicApi=http://jusicMusicApi
ENV MusicExpireTime=1200000 ReTryCount=1 VoteRate=0.3 WyTopUrl=3778678
ENV ServerJUrl=https://sc.ftqq.com/SCU64668T909ada7955daadfb64d5e7652b93fb135dad06e659369.send
ENV IpHouse=3 HouseSize=32

# 这边不要以nohup方式运行，不然容器会被docker自动关闭
ENTRYPOINT java -jar -DAPIUSER=$APIUSER -DAPIPWD=$APIPWD -DRedisHost="$RedisHost" -DMusicApi="$MusicApi" -DMusicExpireTime=$MusicExpireTime -DReTryCount=$ReTryCount -DVoteRate=$VoteRate -DWyTopUrl=$WyTopUrl -DServerJUrl="$ServerJUrl" -DIpHouse=$IpHouse -DHouseSize=$HouseSize ./jusic-serve.jar
```

参数说明

```text
接口认证用户名：APIUSER，默认admin
接口认证密码：APIPWD 默认123456
Redis Host:RedisHost 默认redis，如果不是docker启动的redis，在本地可以直接填写localhost
音乐api host:MusicApi 默认http://jusicMusicApi,与你link的音乐api别名要保持一致，如果不是docker启动的音乐api，在本地可以填写 http://localhost
音乐链接过期时间：MusicExpireTime 默认1200000毫秒
获取音乐失败重试次数：ReTryCount 默认1次
投票切歌率：VoteRate 默认0.3
网易热歌榜歌单id：WyTopUrl 默认3778678
个人Server酱接口：ServerJUrl 默认https://sc.ftqq.com/SCU64668T909ada7955daadfb64d5e7652b93fb135dad06e659369.send，必须修改，否则当有用户@管理员时，消息会发到我这里
每个ip限制创建房间数：IpHouse 默认3个
系统最多可创建房间数：HouseSize 默认32个
创建镜像
docker image build -t jusic_serve_houses:1.0 .

本地运行测试
运行前要先拉取及运行redis及音乐api镜像jusic_music_api
docker run --name jusic_serve_houses -e APIPWD=123 -e MusicApi="http://musicApi" -p 8888:8888 -d --link redis:redis --link jusic_music_api:musicApi jusic_serve_houses:1.0
浏览器访问localhost:8888查看效果，如果没启动成功，可以使用docker命令查看日记：docker logs jusic_serve_houses。进入容器内部执行命令：docker exec -it jusic_serve_houses /bin/bash

发布镜像
如果测试一切运行正常，那就可以把镜像发布至docker官方。
一. 登录
docker login
二. 为本地的 image 标注用户名和版本
docker image tag jusic_serve_houses:1.0 jumpalang/jusic_serve_houses:1.0
三. 发布镜像
docker image push jumpalang/jusic_serve_houses:1.0
四. 完善镜像详细信息
访问官方镜像网站 [http://hub.docker.com](http://hub.docker.com)，填写镜像的描述信息及详细信息

使用docker-compose一键启动项目
上一步骤运行一起听歌吧应用还比较麻烦，要自己先启动音乐api及redis，使用docker-compose就可以很方便的运行起整个项目，如未使用过docker-compose建议先看看阮一峰博客的这篇文章：Docker 微服务教程

编写docker-compose.yml
```

```yaml
version: "3"
services:
 service_redis:
     restart: always #异常关闭后会再自动重启
     #    ports:
     #      - 6379:6379   #可以不暴露给宿主机
     image: redis
     container_name: redis
     environment:
         - TZ=Asia/Shanghai
     command: redis-server
     volumes:
         - D:\docker\redis\data:/data  #redis数据挂载到本地，不然重启容器数据就丢失了
 service_jusicMusicApi:
     image: jumpalang/jusic_music_api:1.0
     environment:
         - QQ=1040927107 #qq号
     container_name: jusicMusicApi
     ports:
         #      - "3000:3000"
         - "3300:3300"  #qq音乐接口要暴露给宿主机，因为有可能要设置cookie
         #      - "3400:3400"
         #      - "8081:8081"
     restart: always
 service_jusicServeHouses:
     container_name: jusicServeHouses
     image: jumpalang/jusic_serve_houses:1.0
     environment:
         - MusicApi=http://jusicMusicApi  #必须与service_jusicMusicApi的 container_name一致
         - APIUSER=admin  #api认证接口用户名
         - APIPWD=123456  #api认证接口密码
         - ServerJUrl=https://sc.ftqq.com/SCU64668T909ada7955daadfb64d5e7652b93fb135dad06e659369.send #server酱消息接口，用户@管理员时会通知微信
     # 其他要设置的环境变量都可在此设置
     ports:
         - "8888:8888"
     depends_on:
         - service_redis
         - service_jusicMusicApi
     restart: always
```

```text
本地运行测试
docker-compose up -d, 启动相关容器，-d参数使得容器在后台运行。
docker-compose stop 关闭相关容器
docker-compose rm 删除相关容器

docker其他常用命令
列出本机的所有 image 文件。
docker image ls

拉取镜像至本地
docker image pull library/hello-world
library/hello-world是 image 文件在仓库里面的位置，其中library是 image 文件所在的组，hello-world是 image 文件的名字。
由于 Docker 官方提供的 image 文件，都放在library组里面，所以它的是默认组，可以省略。因此，上面的命令可以写成下面这样。

删除 image 文件
docker image rm [imageName]

列出本机正在运行的容器
docker container ls

列出本机所有容器，包括终止运行的容器
docker container ls --all

启动容器
docker container start [containerID]
docker container run命令是新建容器，每运行一次，就会新建一个容器。同样的命令运行两次，就会生成两个一模一样的容器文件。如果希望重复使用容器，就要使用docker container start命令，它用来启动已经生成、已经停止运行的容器文件。

关闭容器
docker container stop [containerID]
docker container kill命令终止容器运行，相当于向容器里面的主进程发出 SIGKILL 信号。而docker container stop命令也是用来终止容器运行，相当于向容器里面的主进程发出 SIGTERM 信号，然后过一段时间再发出 SIGKILL 信号。
这两个信号的差别是，应用程序收到 SIGTERM 信号以后，可以自行进行收尾清理工作，但也可以不理会这个信号。如果收到 SIGKILL 信号，就会强行立即终止，那些正在进行中的操作会全部丢失。

删除容器
docker container rm [containerID]

总结
制作镜像时，切记不能让所有应用都在后台运行，要保持一个在前台运行
docker还停留在表面使用，参数详细作用或者参数之间的区别还未了解，如links与depends_on区别
docker docker镜像制作 linux运维
 tencent video business
开源的优秀后端管理系统 
未找到相关的 Issues 进行评论

请联系 @JumpAlang 初始化创建

使用 GitHub 登录
```
