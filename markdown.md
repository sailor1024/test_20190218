### git操作

#### git切换分支操作
从远程拉取分支并且关联到本地分支上
```git
git fetch origin --prune      更新远程分支
git branch -a                 查看所有分支
git checkout -t [branchname]  创建本地分支并关联远程分支，不用带remote前缀
```

#### git合并分支操作
假设此时在dev分支上，需要把dev分支的代码合并到master分支上去。
```git
git branch -> 显示当前分支：dev
git pull origin dev -> 确保dev分支的代码是最新的
git checkout master -> 切换master分支
git pull origin master -> 确保master分支的代码是最新的
git merge dev -> 合并dev分支的代码
git push origin master -> 更新到远程仓库
```
