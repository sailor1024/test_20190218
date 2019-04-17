<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/7
 * Time: 10:56
 */

namespace app\index2\model;

use think\Exception;
use think\Model;


class ItemsDir extends Model
{   //插入前验证
    protected $rule = [
        ['dir_name', 'require|length:1,40|chsDash', '文件名称必须|名称最多不能超过40个且大于1个字符|数据类型错误'],
        ['dir_father_id', 'number', '数字型'],
        ['items_num', 'number', '数字型'],
        ['user_id', 'require|number|>:0', '创建者Id必须|数字型|大于0'],
        ['company_id', 'require|number|>:0', '所属公司id|数字型|大于0'],
        ['path', 'alphaDash', 'URL格式错误'],
        ['create_time', 'require|number|>:0', '文件夹创建时间|数字型|大于0'],
        ['update_time', 'require|number|>:0', '文件夹更新时间|数字型|大于0'],
        ['valid', 'number', '数字型']
    ];
    //修改前验证
    protected $uprule = [
        ['dir_name', 'length:1,40|chsDash', '名称最多不能超过40个且大于1个字符|数据类型错误'],
        ['dir_father_id', 'number', '数字型'],
        ['items_num', 'number', '数字型'],
        ['user_id', 'number|>:0', '数字型|大于零'],
        ['company_id', 'number|>:0', '数字型|大于零'],
        ['path', 'alphaDash', 'URL格式错误'],
        ['create_time', 'number|>:0', '数字型|大于零'],
        ['update_time', 'number|>:0', '数字型|大于零'],
        ['valid', 'number', '数字型']
    ];

    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'items_dir';//  实例话对象表名称
    }

    /**
     * 添加动作
     */
    public function add($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if ($this->validate($this->rule)->save($param)) {
            return ['code' => 200, 'id' => $this->id, 'info' => lang('message200')];
        }
        return ['code' => 401, 'id' => 0, 'info' => $this->getError()];

    }

    /**
     *  按条件修改指定的字段
     **/
    public function up($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where'])) {

            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        $field = [];
        $where = $param['where'];
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if ($this->validate($this->uprule)->save($field, $where)) {
            return ['code' => 200, 'info' => lang('message200')];
        }
        return ['code' => 401, 'info' => $this->getError()];
    }

    /**
     * 获取一条记录
     **/
    public function getArr($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }

        if (empty($param['where'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        $field = [];
        if (empty($param['where']['valid'])) {
            $param['where']['valid'] = 1;
        }
        $where = $param['where'];
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if ($array = $this->where($where)->field($field)->find()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];
    }

    /**
     * 获取一组记录
     */
    public function getList($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $where = [];
        $field = [];
        $order = [];
        if (!empty($param['where'])) {
            $where = $param['where'];
        }
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if (!empty($param['order'])) {
            $order = $param['order'];
        }
        if (empty($param['where']['valid'])) {
            $param['where']['valid'] = 1;
        }
        if ($array = $this->where($where)->field($field)->order($order)->select()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];

    }

    public function del($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        if ($this->where($param)->delete()) {
            return ['code' => 200, 'info' => lang('message200')];
        }
        return ['code' => 401, 'info' => $array];
    }

    /***
     * 捕获器
     */
    public function getCreateTimeAttr($value)
    {
        return $value * 1000;
    }

    /***
     * 捕获器
     */
    public function getUpdateTimeAttr($value)
    {
        return $value * 1000;
    }
    /**数据中间层**/
    /****
     *   逻辑删除文件夹
     **/
    public function rmFile($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $this->startTrans();
        try {
            $param['field']['valid'] = 0;
            $array = $this->up($param);
            if ($array['code'] != 200) {
                return ['code' => 401, 'info' => $array[lang('message401')]];
            }
            $path = $this->where($param['where'])->field('path')->find();
            if (!empty($path['path'])) {
                $array = $this->rmPath($path['path']);
            }
            $this->commit();
        } catch (Exception $e) {
            $array = ['code' => 500, 'info' => $e->getMessage()];
            $this->rollback();
        }
        return $array;
    }

    /**
     * 修改文件名称
     */
    public function upFileName($param)
    {
        $array = [];
        $_param = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => [lang('no_array')]];
        }
        if (empty($param['field']['dir_name'])) {
            return ['code' => 411, 'info' => [lang('message411')]];
        }
        $len = strlen($param['field']['dir_name']);
        if ($len <= 1) {
            return ['code' => 407, 'info' => [lang('message407')]];
        }
        try {
            //限制同名文件夹
            $_param['where']['id'] = $param['where']['id'];
            $_param['field'] = 'dir_father_id';
            $array = $this->getArr($_param);
            $_param = [];
            $_param['where']['dir_father_id'] = $array['info']['dir_father_id'];
            $_param['where']['dir_name'] = $param['field']['dir_name'];
            $_param['where']['company_id'] = $param['where']['company_id'];
            $array = $this->getArr($_param);
            if ($array['code'] == 200) {
                return ['code' => 410, 'info' => [lang('message410')]];
            }
            $array = $this->up($param);
        } catch (Exception $e) {
            $array = ['code' => 500, 'info' => $e->getMessage()];
        }

        return $array;
    }

    /**
     *遍历修改虚拟路径
     **/
    public function fetchUpPath($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $userAarray = json_decode($param['where']['id'], true);
        if (!is_array($userAarray)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $param['field']['dir_father_id'] = empty($param['field']['dir_father_id']) ? 0 : $param['field']['dir_father_id'];
        $this->startTrans();
        try {

            $_temp_update_high = [];//合作者最高层显示
            $_temp_update_high['id'] = $param['where']['id'];//文件夹id
            $_temp_update_high['dir_father_id'] = $param['field']['dir_father_id'];//移动到某个文件夹的id
            $_temp_update_high['is_dir_items'] = 1;//1代表的是文件夹，
            $this->updateHighFloor($_temp_update_high);//修改合作者最高级显示问题
            unset($_temp_update_high);

            $user_id = empty($param['where']['user_id']) ? 0 : $param['where']['user_id'];
            $InviteModel = new InviteCooperator();
            $InviteData = [];
            foreach ($userAarray as $key => $value) {
                $array[$key]['id'] = $value;
                $array[$key]['dir_father_id'] = $param['field']['dir_father_id'];
                if ($param['field']['dir_father_id'] > 0) {
                    $p = $this->getPath($value, $param['field']['dir_father_id'], $user_id);
                    $array[$key]['path'] = $p['info'][1];
                } elseif ($param['field']['dir_father_id'] == 0) {
                    $array[$key]['path'] = $value;
                    $_p = $this->where(['id' => $value])->field('path')->find();
                    $p['info'][0] = $_p['path'];
                    $p['info'][1] = $value;
                }
                $this->upAllPath($p['info'][0], $p['info'][1]);//子目录
            }
            if ($this->saveAll($array)) {
                $_param = [];
                foreach ($userAarray as $key => $value) {
                    if ($param['field']['dir_father_id'] > 0) {//将移动的目录分享出去
                        $_param['items_dir_id'] = $param['field']['dir_father_id'];
                        $_param['dir_id'] = $value;
                        $_param['company_id'] = $param['where']['company_id'];
                        $array[] = $this->setInviteItems($_param);
                        unset($_param);
                    }
                    $_param['items_dir_id'] = $value;
                    $InviteModel->setInvitePath($_param);
                }
                $array = ['code' => 200, 'info' => [lang('message200')]];
            }
            $this->commit();
        } catch (Exception $exception) {
            $array = ['code' => 500, 'info' => $exception->getMessage()];
            $this->rollback();
        }
        return $array;
    }

    /***
     * 移动新建文件夹后判断是否有分享并分享出去
     * @param array 文件夹ID,文件夹移动者UID,公司company_id
     *
     **/
    public function setInviteItems($param)
    {

        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => [lang('no_array')]];
        }
        if (empty($param['items_dir_id'])) {//父亲ID
            return ['code' => 401, 'info' => [lang('is_empty')]];
        }
        if (empty($param['dir_id'])) {//文件夹ID
            return ['code' => 401, 'info' => [lang('is_empty')]];
        }
        if (empty($param['company_id'])) {
            return ['code' => 401, 'info' => [lang('is_empty')]];
        }

        try {
            $InviteModel = new InviteCooperator();
            $_param = [];
            $_param['where']['items_dir_id'] = $param['items_dir_id'];
            $_param['where']['company_id'] = $param['company_id'];
            if (!empty($param['user_id'])) {
                $_param['where']['user_id'] = $param['user_id'];
            }
            $_param['field'] = ['invite_user_id', 'edit_type', 'user_id'];//所需要分享出去的用户ID
            $array = $InviteModel->getList($_param);
            if ($array['code'] != 200) {
                return ['code' => 401, 'info' => [lang('no_array')]];
            }
            foreach ($array['info'] as $k => $value) {
                $userArray[$k] = $value['invite_user_id'];
                $edit_type[$k] = $value['edit_type'];
                $user_id = $value['user_id'];
            }
            if (empty($userArray)) {
                return ['code' => 401, 'info' => [lang('no_array')]];
            }
            //查找Path--findFielPorjckt
            //获取子目录的path
            $_param = [];
            $_param['where']['id'] = $param['dir_id'];
            $_param['field'] = ['path'];
            $path = $this->getArr($_param);
            if ($path['code'] != 200) {
                return ['code' => 401, 'info' => [lang('no_array')]];
            }
            $_findData = $this->findFielPorjckt($path['info']['path']);
            foreach ($userArray as $k => $value) {
                if (!empty($_findData['items_dir'])) {
                    foreach ($_findData['items_dir'] as $kk => &$v) {
                        $v['user_id'] = $user_id;
                        $v['invite_user_id'] = $value;
                        $v['company_id'] = $param['company_id'];
                        $v['is_dir_items'] = 1;
                        //分享的数据
                        $vv['company_id'] = $param['company_id'];
                        $vv['user_id'] = $user_id;
                        $vv['invite_user_id'] = $value;
                        $vv['items_dir_id'] = $v['items_dir_id'];
                        $array = $InviteModel->where($vv)->field('id')->find();
                        if ($array['id']) {
                            unset($_findData['items_dir'][$kk]);
                            unset($edit_type[$k]);
                        } else {
                            $v['edit_type'] = $edit_type[$k];
                            $v['create_time'] = time();
                            $v['update_time'] = time();
                        }
                    }
                    $start = $InviteModel->saveAll($_findData['items_dir']);
                }
                if (!empty($_findData['items'])) {
                    foreach ($_findData['items'] as $kk => &$_v) {
                        $_v['user_id'] = $user_id;
                        $_v['invite_user_id'] = $value;
                        $_v['company_id'] = $param['company_id'];
                        $_v['is_dir_items'] = 2;
                        //查找分享的数据
                        $_vv['company_id'] = $param['company_id'];
                        $_vv['user_id'] = $user_id;
                        $_vv['invite_user_id'] = $value;
                        $_vv['items_id'] = $_v['items_id'];
                        $array = $InviteModel->where($_vv)->field('id')->find();
                        if ($array['id']) {
                            unset($_findData['items'][$kk]);
                            unset($edit_type[$k]);
                        } else {
                            $_v['edit_type'] = $edit_type[$k];
                            $_v['create_time'] = time();
                            $_v['update_time'] = time();
                        }
                    }
                    $start = $InviteModel->saveAll($_findData['items']);

                }

            }
            $array = ['code' => 401, 'info' => [lang('message401')]];
            if (!empty($start)) {
                $array = ['code' => 200, 'info' => [lang('message200')]];
            }
        } catch (Exception $exception) {
            $array = ['code' => 500, 'info' => [$exception->getMessage()]];
        }
        return $array;
    }



    protected function getPath($id, $fid = 0, $userId = 0)
    {
        $array = [];
        $data = [];
        if (empty($id)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if ($fid == 0) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }

        $where['id'] = $id;
        if ($userId > 0) {
            $where['user_id'] = $userId;
        }
        try {
            $path = $this->where($where)->field(['path'])->find();
            if (empty($path)) {
                return ['code' => 401, 'info' => $array[lang('no_array')]];
            }
            if ($fid > 0) {
                $array = $this->fileTree($fid);
                $_path = implode('-', $array) . '-' . $id;
                $data = [
                    $path['path'],
                    $_path
                ];
                $array = ['code' => 200, 'info' => $data];
            }

        } catch (Exception $e) {
            $array = ['code' => 500, 'info' => $e->getMessage()];
        }
        return $array;
    }

    /**
     * 返回文件夹的所有者信息
     * @pid int 文件夹id
     */
    public function geitFileMasg($pid)
    {
        $array = [];
        if (empty($pid)) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
        }
        $array['where']['id'] = $pid;
        $array['field'] = ['dir_name', 'user_id', 'company_id'];
        $result = $this->getArr($array);
        return $result;
    }

    /**
     * 对表 插入数据并判断是否写入虚拟路径
     */
    public function setPath($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $this->startTrans();// 开启事务
        try {
            // 插入前开始验证
            if (!empty($param['dir_father_id'])) {
                $_array = $this->geitFileMasg($param['dir_father_id']);
                if ($_array['code'] != 200) {
                    return ['code' => 401, 'info' => $array[lang('no_array')]];
                }
                if ($_array['info']['company_id'] != $param['company_id']) {
                    return ['code' => 409, 'info' => $array[lang('message409')]];
                }
                //准备限制文件夹名称
                $_param = [];
                $_param['where']['dir_name'] = $param['dir_name'];
                $_param['where']['dir_father_id'] = $param['dir_father_id'];
                $array = $this->getArr($_param);

                if ($array['code'] == 200) {//及发现同一目录下有重名文件夹
                    return ['code' => 410, 'info' => [lang('message410')]];
                }
                // $array = $this->fileTree($param['dir_father_id']);
                //$param['field']['path'] = implode('-', $array) . '-';

            }
            $woke = $this->add($param);
            $array = ['code' => 401, 'info' => lang('message401')];
            if ($woke['code'] == 200) {
                $array = $this->fileTree($param['dir_father_id']);
                $param['field']['path'] = (!empty($array)) ? implode('-', $array) . '-' : '';
                $param['where']['id'] = $woke['id'];
                $param['field']['path'] .= $woke['id'];
                $array = $this->up($param);
                $_param = [];
                if ($param['dir_father_id'] > 0) {// 把文件夹分享出去
                    $_param['items_dir_id'] = $param['dir_father_id'];
                    $_param['dir_id'] = $woke['id'];
                    $_param['company_id'] = $param['company_id'];
                    $this->setInviteItems($_param);
                }
            }
            $this->commit();
        } catch (Exception $e) {
            $array = ['code' => 500, 'info' => $e->getMessage()];
            $this->rollback();
        }
        return $array;
    }

    /**
     * 递归函数 查找文件夹父ID
     * @return  array
     * @fieldId int
     */
    protected function fileTree($fileId)
    {
        $array = [];
        $param['where']['id'] = $fileId;
        $param['field'] = ['dir_father_id'];
        $pId [] = $this->where(['id' => $fileId])->field(['dir_father_id', 'id'])->find();
        if ($pId[0]['id'] > 0) {
            $array = $this->fileTree($pId[0]['dir_father_id']);
            $array[] = $fileId;
        }
        return $array;
    }

    /***
     * 查找子ID包括子项目ID修改path
     * @path 查找的path
     * @_path 要替换的path
     */
    protected function upAllPath($path, $_path = '')
    {
        if (empty($path)) {
            return ['code' => 401, 'message' => lang('message401')];
        }
        $pathSelect = $path . '-';
        //查询文件夹
        $data = [];
        $pathArray = [];
        $_pathArray = [];
        $starPath = '';
        $InviteData = [];
        try {
            $dirPathData = $this->where('path', 'like', $pathSelect . '%')->field('id,path')->select();
            if (!empty($dirPathData[0])) {
                foreach ($dirPathData as $key => $val) {
                    $starPath = str_replace($path, $_path, $val['path']);
                    $pathArray[$key]['id'] = $val['id'];
                    $pathArray[$key]['path'] = $starPath;
                    //遍历分享表
                }
                $data = $this->saveAll($pathArray);
            }
            unset($InviteData);
            $itemModel = new  Items();//操作项目
            $dirPathData = $itemModel->where('path', 'like', $pathSelect . '%')->field('id,path')->select();
            if (!empty($dirPathData[0])) {
                unset($starPath);
                foreach ($dirPathData as $key => $val) {
                    $starPath = str_replace($path, $_path, $val['path']);
                    $_pathArray[$key]['id'] = $val['id'];
                    $_pathArray[$key]['path'] = $starPath;
                    //遍历分享表
                }
                $data = $itemModel->saveAll($_pathArray);
            }
            if ($data) {
                $data = ['code' => 200, 'message' => lang('message200')];
            }
            //$this->commit();
        } catch (Exception $e) {
            $data = ['code' => 500, 'message' => $e->getMessage()];
            //$this->rollback();
        }

        return $data;
    }


    /**
     * 遍历文件下所有的子目录并删除
     **/
    protected function rmPath($path)
    {
        if (empty($path)) {
            return ['code' => 401, 'message' => lang('message401')];
        }
        $ids = [];
        $pathSelect = $path . '-';
        $InviteModel = new InviteCooperator();
        try {
            $data = ['code' => 401, 'message' => lang('message401')];
            $dirPathData = $this->where('path', 'like', $pathSelect . '%')->field('id,path')->select();
            if (!empty($dirPathData[0])) {
                foreach ($dirPathData as $key => $val) {
                    $pathArray[$key]['id'] = $val['id'];
                    $pathArray[$key]['valid'] = 0;
                    $ids[] = $val['id'];
                }
                $data = $this->saveAll($pathArray);
                $InviteModel->where('items_dir_id', 'in', $ids)->delete();
            }
            $itemModel = new  Items();//操作项目
            $dirPathData = $itemModel->where('path', 'like', $pathSelect . '%')->field('id,path')->select();
            if (!empty($dirPathData[0])) {
                foreach ($dirPathData as $key => $val) {
                    $_pathArray[$key]['id'] = $val['id'];
                    $_pathArray[$key]['valid'] = 0;
                    $ids[] = $val['id'];
                }
                $data = $itemModel->saveAll($_pathArray);
                $InviteModel->where('items_id', 'in', $ids)->delete();
            }
            if ($data) {
                $data = ['code' => 200, 'message' => lang('message200')];
            }
            //$this->commit();
        } catch (Exception $e) {
            $data = ['code' => 500, 'message' => $e->getMessage()];
            //$this->rollback();
        }

        return $data;
    }
    /***
     * 获取当前目录下的所有子项目
     */
    /*public function getFileList($param)
    {
        $array = [];//查询结果
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        //查询两张表的所有目录
        $param['where']['user_id'] = $param['user_id'];
        $param['where']['valid'] = 1;


    }*/

    /**
     * 文件夹所有目录，包括子级目录
     */
    public function getDirList($param)
    {
        $array = [];

        if (!is_array($param)) {
            return ['code' => 401, 'message' => $array[lang('no_array')]];
        }

        $entity = [];

        //$itemsDir = new \app\index2\model\ItemsDir();
        $entity['where']['company_id'] = $param['company_id'];
        $entity['where']['valid'] = 1;
        $entity['field'] = ['id,user_id as userid,dir_name as name,dir_father_id as pid,path'];

        if ($param['user_type'] == 1 || $param['user_type'] == 2) { //管理员
            // $entity['where']['company_id'] = $param['company_id'];
        } else if ($param['user_type'] == 3) { //合作者
            // $entity['where']['company_id'] = $param['company_id'];
            $entity['where']['user_id'] = $param['user_id'];
        }

        $dirList = $this->getList($entity);

        if ($dirList['code'] != 200) {
            //return ['code' => 401, 'message' => $array[lang('is_empty')]];
            return ['code' => 200, 'message' => 'no_data'];
        }
        $getDirList = $dirList['info'];

        if ($param['user_type'] == 3) { //只有普通合作者才需要执行
            foreach ($getDirList as $v) {
                $temp_father = 1;
                foreach ($getDirList as $v2) {
                    if ($v['pid'] == $v2['id']) { //证明父级的目录是自己所有
                        $temp_father = 2;
                        break;
                    }

                }

                if ($temp_father == 1) { //证明父级的目录非自己所有
                    $v['pid'] = 0; //将父级 dir_father_id 修改
                }
            }
        }

        //  $getDirTree=$this->get_tree( $getDirList,0);

        return ['code' => 200, 'message' => 'success!', 'data' => $getDirList];


    }


    //修改合作者最高级显示问题，11-19，kesheng
    public function updateHighFloor($entity)
    {

        /* $entity['is_dir_items']  =1;
        $entity['dir_father_id']  = 332;
        $entity['id']  = 334; */
        $param = [];
        $param['field']['dir_father_id'] = $entity['dir_father_id'];//移动到某个文件夹的id
        $param['where']['id'] = json_decode($entity['id'], true); //文件夹id,数组 [11,555,44,88,99]
        $entity['is_dir_items'] = $entity['is_dir_items'];//判断是文件夹或项目，1文件夹，2是项目

        /*  echo $param['field']['dir_father_id'] ."<br/>";
       // echo  $param['where']['id']."<br/>";
        echo $entity['is_dir_items']."<br/>";  */
        $saveAllParam = [];

        if ($param['field']['dir_father_id'] == 0) { //将文件夹和文件夹移动到首层

            foreach ($param['where']['id'] as $v) {
                // $param['field']['high_floor'] = 1;//自己最高层
                $param_1['high_floor'] = 1;//全部最高层
                $param_1['id'] = $v;
                $saveAllParam[] = $param_1;


            }


        } elseif ($param['field']['dir_father_id'] > 0) {


            $_temp_father = [];
            $_temp_one = [];
            $_temp_father['where']['id'] = $param['field']['dir_father_id'];
            $_temp_father['field'] = ['id,user_id,high_floor'];

            $_temp_one['where']['id'] = ['in', $param['where']['id']];
            $_temp_one['field'] = ['id,user_id,high_floor'];

            $get_temp_father = $this->getArr($_temp_father); //父级
            if ($entity['is_dir_items'] == 1) {   //文件夹
                $get_temp_one = $this->getList($_temp_one); //子级文件夹

            } else {
                $items = new Items();
                $_temp_one['page'] = -1;
                $get_temp_one = $items->getList($_temp_one); //子级项目
                // echo 333333;
            }
            //echo 22222;
            if ($get_temp_one['code'] == 200) {
                //  echo 111111;
                foreach ($get_temp_one['info'] as $v1) {
                    if ($v1['high_floor'] == 1) {
                        //  echo 4444;
                        //判断father_id
                        if ($get_temp_father['code'] == 200) {
                            //   echo 5555;
                            // if($get_temp_father['info']['high_floor'] == 1  ){//移动到的目录
                            if ($get_temp_father['info']['user_id'] == $v1['user_id']) { //两个目录都是同个人创建
                                $param_3['high_floor'] = 0;//子级非最高层
                                $param_3['id'] = $v1['id'];

                                $saveAllParam[] = $param_3;
                            } else {//去合作表中

                                $_temp_coop = [];
                                $_temp_coop['where']['id'] = $get_temp_father['info']['id'];
                                $_temp_coop['field'] = ['id'];
                                $inviteCooperator = new InviteCooperator();
                                $getfatherdir = $inviteCooperator->getArray($_temp_coop);
                                if ($getfatherdir['code'] == 200) { //证明父级目录非自己，但自己可以管理
                                    $param_4['high_floor'] = 0;//子级非最高层
                                    $param_4['id'] = $v1['id'];
                                    $saveAllParam[] = $param_4;
                                }
                                unset($_temp_coop);
                            }
                            //}else{
                            //  }
                        }
                    } else {//不需要在乎移动到哪个目录下

                    }
                }
            }


        }

        if ($entity['is_dir_items'] == 1) {
            $this->saveAll($saveAllParam);
        } else {
            $items = new Items();
            $items->saveAll($saveAllParam);
        }

        //修改合作者表的合作者显示问题
        $inviteCooperator = new InviteCooperator();
        if ($param['field']['dir_father_id'] == 0) {
            //修改所有合作者对该文件夹或项目的最高级显示
            $saveCoopParamHighId = [];
            if ($entity['is_dir_items'] == 1) { //文件夹
                $saveCoopParamHighId['where']['items_dir_id'] = ['in', $param['where']['id']]; //数组[2,33,11,56]

            } else {
                $saveCoopParamHighId['where']['items_id'] = ['in', $param['where']['id']];//数组[2,33,11,56]
            }

            $saveCoopParamHighId['field'] = ['id'];
            //查找出id
            $get_one_id_info = $inviteCooperator->getList($saveCoopParamHighId);
            $get_one_message = [];
            if ($get_one_id_info['code'] == 200) {
                foreach ($get_one_id_info['info'] as $vv_temp) {
                    $temp_7 = [];
                    $temp_7['id'] = $vv_temp['id'];
                    $temp_7['high_floor'] = 1;
                    $get_one_message[] = $temp_7;
                }
                $inviteCooperator->saveAll($get_one_message);
                unset($saveCoopParamHighId);
            }


        } else {
            //找出所有的父级目录拥有的所有的合作者
            $_param_father_has_can_temp = [];
            $_param_father_has_can_temp['where']['items_dir_id'] = $param['field']['dir_father_id'];
            $_param_father_has_can_temp['field'] = ['invite_user_id'];
            $get_father_message_temp_8 = $inviteCooperator->getList($_param_father_has_can_temp);
            unset($_param_father_has_can_temp);
            $get_father_message_temp_invite_id = [];
            if ($get_father_message_temp_8['code'] == 200) {
                foreach ($get_father_message_temp_8['info'] as $va_id) {
                    $get_father_message_temp_invite_id[] = $va_id['invite_user_id'];//获取所有父级拥有的合作者
                }
            }

            if (empty($get_father_message_temp_invite_id)) { //父级拥有空
                //修改所有合作者对该文件夹或项目的最高级显示
                $saveCoopParamHighId = [];
                if ($entity['is_dir_items'] == 1) { //文件夹
                    $saveCoopParamHighId['where']['items_dir_id'] = ['in', $param['where']['id']]; //数组[2,33,11,56]

                } else {
                    $saveCoopParamHighId['where']['items_id'] = ['in', $param['where']['id']];//数组[2,33,11,56]
                }

                $saveCoopParamHighId['field'] = ['id'];
                //查找出id
                $get_one_id_info = $inviteCooperator->getList($saveCoopParamHighId);
                $get_one_message = [];
                if ($get_one_id_info['code'] == 200) {
                    foreach ($get_one_id_info['info'] as $vv_temp) {
                        $temp_7 = [];
                        $temp_7['id'] = $vv_temp['id'];
                        $temp_7['high_floor'] = 1;
                        $get_one_message[] = $temp_7;
                    }
                    $inviteCooperator->saveAll($get_one_message);
                    unset($saveCoopParamHighId);
                }
            } else {//父级权限也有
                //获取自己所有的合作者
                $_param_one_has_can_temp = [];
                if ($entity['is_dir_items'] == 1) { //文件夹
                    $_param_one_has_can_temp['where']['items_dir_id'] = ['in', $param['where']['id']]; //数组[2,33,11,56]
                } else {
                    $_param_one_has_can_temp['where']['items_id'] = ['in', $param['where']['id']];//数组[2,33,11,56]
                }
                $_param_one_has_can_temp['field'] = ['invite_user_id,id'];
                $get_one_message_temp = $inviteCooperator->getList($_param_one_has_can_temp);
                unset($_param_one_has_can_temp);

                /* $get_one_message_temp_invite_id = [];
                if($get_one_message_temp['code']  == 200 ){
                    foreach( $get_one_message_temp['info'] as $va_id){
                        $get_one_message_temp_invite_id[] = $va_id['invite_user_id'] ;//获取所有子级拥有的合作者
                    }
                } */
                $save_coop_one_message_high = [];
                foreach ($get_father_message_temp_invite_id as $vv_id) { //[22,45,456,1] invite_user_id
                    foreach ($get_one_message_temp['info'] as $v_one_id) { //将子级的用户者与父级同时拥有者除去
                        $temp_3 = [];
                        $temp_3['id'] = $v_one_id['id'];
                        $temp_3['high_floor'] = 1;
                        if ($vv_id == $v_one_id['invite_user_id']) { //证明该合作者可以查看父级目录
                            $temp_3['high_floor'] = 0;
                        }
                        $save_coop_one_message_high[] = $temp_3;

                    }
                }

                $inviteCooperator->saveAll($save_coop_one_message_high);
            }

        }

    }

    /****
     *   查找所有的子目录和子项目
     ***/
    public function findFielPorjckt($path)
    {
        $array = [];
        if (empty($path)) {
            return ['code' => 401, 'message' => [lang('is_empty')]];
        }
        // $path .= '-';
        //先查找文件夹
        $_fierData = [];
        $fierData = $this->where('path', 'like', $path . '%')->field(['id', 'path', 'dir_father_id'])->select();
        if (!empty($fierData)) {
            foreach ($fierData as $k => $v) {
                $_fierData[$k]['items_dir_id'] = $v['id'];
                $_fierData[$k]['path'] = $v['path'];
                $_fierData[$k]['father_id'] = $v['dir_father_id'];
            }
        }
        $_porjcktData = [];
        $_porjcktModel = new Items();
        $porjcktData = $_porjcktModel->where('path', 'like', $path . '%')->field(['id', 'path', 'items_dir_id'])->select();
        if (!empty($porjcktData)) {

            foreach ($porjcktData as $k => $v) {
                $_porjcktData[$k]['items_id'] = $v['id'];
                $_porjcktData[$k]['path'] = $v['path'];
                $_porjcktData[$k]['father_id'] = $v['items_dir_id'];
            }
        }
        if (!empty($_fierData)) {
            $array['items_dir'] = $_fierData;
        }
        if (!empty($_porjcktData)) {
            $array['items'] = $_porjcktData;
        }
        return $array;
    }
}

?>

