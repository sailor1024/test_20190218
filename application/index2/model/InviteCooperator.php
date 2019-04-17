<?php
namespace app\index2\model;

use think\Exception;
use think\Model;

class InviteCooperator extends Model
{
    //插入前验证
    protected $rule = [
        ['user_id', 'require|number|>:0', '用户Id必须|数字型|大于0'],
        ['invite_user_id', 'require|number|>:0', '用户Id必须|数字型|大于0'],
        ['company_id', 'require|number|>:0', '公司Id必须|数字型|大于0'],
        ['items_dir_id', 'number|>=:0', '数字型|大于0'],
        ['items_id', 'number|>=:0', '数字型|大于0'],
        ['father_id', 'number|>=:0', '数字型|大于0'],
        ['is_dir_items', 'require|number|>:0', '类型Id必须|数字型|大于0'],
        ['path', 'chsDash', '字符串类型'],
        ['edit_type', 'number|>=:0', '数字型|大于0'],
        ['create_time', 'require|number|>:0', '创建时间必须|数字型|大于0'],
        ['update_time', 'require|number|>:0', '修改时间必须|数字型|大于0'],

    ];
    //修改前验证
    protected $uprule = [
        ['user_id', 'number|>:0', '数字型|大于0'],
        ['invite_user_id', 'number|>:0', '数字型|大于0'],
        ['company_id', 'number|>:0', '数字型|大于0'],
        ['items_dir_id', 'number|>:0', '数字型|大于0'],
        ['items_id', 'number|>:0', '数字型|大于0'],
        ['father_id', 'number|>:0', '数字型|大于0'],
        ['is_dir_items', 'number|>:0', '数字型|大于0'],
        ['path', 'chsDash', '字符串类型'],
        ['edit_type', 'number|>:0', '数字型|大于0'],
        ['create_time', 'number|>:0', '数字型|大于0'],
        ['update_time', 'number|>:0', '数字型|大于0'],
    ];
    protected $resultSetType = 'collection';

    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'invite_cooperator';//  实例话对象表名称
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
            return ['code' => 200, 'id' => $this->id, 'info' => lang('massage200')];
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
            return ['code' => 200, 'info' => lang('massage200')];
        }
        return ['code' => 401, 'info' => $this->getError()];
    }

    /**
     * 获取一条记录
     */
    public function getArray($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
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
        if ($this->where($param['where'])->delete()) {
            return ['code' => 200, 'info' => lang('message200')];
        }
        return ['code' => 401, 'info' => $this->getError()];
    }
    /****数据中间层***/
    /***
     *  遍历权限
     ***/
    public function fecDiction($param)
    {
        $array = [];
        $jsonArray = [];
        if (!is_array($param)) {
            return true;
        }
        if (empty($param['user_id'])) {
            return true;
        }
        if (empty($param['items_dir_id']) && empty($param['items_id'])) {
            return true;
        }

        //处理JSON数组
        $jsonArray = (empty($param['items_dir_id'])) ? json_decode($param['items_id'], true) : json_decode($param['items_dir_id'], true);
        if (!is_array($jsonArray)) {
            return true;
        }
        $key = (empty($param['items_dir_id'])) ? 'items_id' : 'items_dir_id';

        //$_param['user_id'] = $param['user_id'];
        //$_param['where'][$key] = [];
        foreach ($jsonArray as $val) {
            $param[$key] = $val;
            $array [] = $this->jurisdiction($param);
        }
        if (in_array(1, $array)) {
            return true;
        }
        return false;
    }

    /**
     *获取操作权限
     **/
    public function jurisdiction($param)
    {
        $array = [];
        if (!is_array($param)) {
            return true;
        }
        if (empty($param['user_id'])) {
            return true;
        }
        if (!isset($param['items_dir_id']) && !isset($param['items_id'])) {
            return false;
        }

        $param['where']['invite_user_id'] = $param['user_id'];//查看邀请人的ID
        if (!empty($param['items_dir_id'])) {
            $param['where']['items_dir_id'] = $param['items_dir_id'];
        }
        if (!empty($param['items_id'])) {
            $param['where']['items_id'] = $param['items_id'];
        }
        $param['field'] = 'edit_type';
        $array = $this->getArray($param);
        if ($array['code'] == 200) {
            return $array['info']['edit_type'];
        }
        return false;
    }

    /***
     * 邀请合作者管理文件夹或文件
     */
    public function setInvite($param)
    {

        $array = [];
        $_param = [];
        $where = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        //$this->startTrans();
        try {
            //对邀请的用户处理
            $table = empty($param['file_type']) ? 0 : $param['file_type'];
            if ($table == 0) {
                return ['code' => 401, 'info' => $array[lang('is_empty')]];
            }
            $InviUserInfo = \model('user')->where(['decrypt_email' => decrypt($param['email'])])->field('id,company_id,user_type')->find();// 用户ID
            if ($InviUserInfo['user_type'] != 3) {
                return ['code' => 401, 'info' => $array[lang('user_type')]];
            }
            if ($InviUserInfo['company_id'] != $param['company_id']) {
                return ['code' => 401, 'info' => $array[lang('user_compy')]];
            }
            //  查找项目相关情况
            /* if ($param['user_type'] == 3) {
                $find['where']['user_id'] = $param['user_id'];
            } */

            $find['where']['id'] = $param['items_id'];
            $find['where']['valid'] = 1;
            $find['field'] = ['id', 'company_id', 'path'];
        
            if ($table == 1) {//  查找文件夹表
                $itemsDirModel = new ItemsDir();
                $findData = $itemsDirModel->getArr($find);
                $_param['where']['items_dir_id'] = $findData['info']['id'];
                $_param['where']['company_id'] = $findData['info']['company_id'];
                $_param['where']['invite_user_id'] = $InviUserInfo['id'];
                $_param['field'] = ['path'];
                $array = $this->getArray($_param);
                if ($array['code'] == 200) { //证明已经分享过了
                    return ['code' => 402, 'info' => lang('message402')];
                }

                


                $array = ['code' => 401, 'info' => [lang('message401')]];
                // 遍历文件夹下所有的项目和目录
                if (!empty($findData['info']['path'])) {
                    $_findData = $itemsDirModel->findFielPorjckt($findData['info']['path']);
                    if (!empty($_findData['items_dir'])) {
                        foreach ($_findData['items_dir'] as $k => &$v) {
                            $v['user_id'] = $param['user_id'];
                            $v['invite_user_id'] = $InviUserInfo['id'];
                            $v['company_id'] = $findData['info']['company_id'];
                            $v['is_dir_items'] = 1;
                            //查看是否分享
                            $vv['user_id'] = $param['user_id'];
                            $vv['invite_user_id'] = $InviUserInfo['id'];
                            $vv['company_id'] = $findData['info']['company_id'];
                            $vv['items_dir_id'] = $v['items_dir_id'];
                            $array = $this->where($vv)->field('id')->find();
                            if ($array['id']) {
                                unset($_findData['items_dir'][$k]);
                                continue;
                            } else {
                                $v['edit_type'] = $param['edit_type'];
                                $v['create_time'] = time();
                                $v['update_time'] = time();
                            }
                        }
                        $start = $this->saveAll($_findData['items_dir']);
                    }
                    if (!empty($_findData['items'])) {
                        foreach ($_findData['items'] as $k => &$_v) {
                            $_v['user_id'] = $param['user_id'];
                            $_v['invite_user_id'] = $InviUserInfo['id'];
                            $_v['company_id'] = $findData['info']['company_id'];
                            $_v['is_dir_items'] = 2;
                            //查找分享的数据
                            $_vv['company_id'] = $findData['info']['company_id'];
                            $_vv['user_id'] = $param['user_id'];
                            $_vv['invite_user_id'] = $InviUserInfo['id'];
                            $_vv['items_id'] = $_v['items_id'];
                            $array = $this->where($_vv)->field('id')->find();
                            if ($array['id']) {
                                unset($_findData['items'][$k]);
                                continue;
                            } else {
                                $_v['edit_type'] = $param['edit_type'];
                                $_v['create_time'] = time();
                                $_v['update_time'] = time();
                            }
                        }
                        $start = $this->saveAll($_findData['items']);
                    }
                }
                if (!empty($start)) {
                    $array = ['code' => 200, 'info' => [lang('message200')]];
                }

                //合作者显示问题 kesheng
                $param_set_one_high = [];
                $param_set_one_high['where']['path'] = $findData['info']['path'];
                $param_set_one_high['where']['invite_user_id'] = $InviUserInfo['id'];
                $param_set_one_high['field']['high_floor'] = 1;
                $temp_status = $this->up($param_set_one_high);
           
                $_param_get_all_path['where']['path'] = ['like',$findData['info']['path'].'-%'];
                $_param_get_all_path['where']['invite_user_id'] =  $InviUserInfo['id'];
                $_param_get_all_path['field'] = ['id'];

                $_get_all_path = $this->getList($_param_get_all_path);
                
                if($_get_all_path['code'] == 200){
                    $save_all_path = [];
                    foreach( $_get_all_path['info'] as $a_v){
                        $temp_temp = [];
                        $temp_temp['id'] =  $a_v['id'];
                        $temp_temp['high_floor'] = 0;
                        $save_all_path[] = $temp_temp;

                    }
                    $temp_save_all = $this->saveAll($save_all_path);
                }
                

                

            }
            if ($table == 2) {// 查找项目
                $itemModel = new  Items();
                $findData = $itemModel->getArr($find);
                $_param['user_id'] = $param['user_id'];
                $_param['invite_user_id'] = $InviUserInfo['id'];
                $_param['company_id'] = $findData['info']['company_id'];
                $_param['items_id'] = $findData['info']['id'];
                $_param['is_dir_items'] = $table;
                $_param['edit_type'] = $param['edit_type'];
                $_param['high_floor'] = 1;//合作者显示问题 //hekesheng
                $_param['create_time'] = time();
                $_param['update_time'] = time();
                $_param['path'] = $findData['info']['path'];
                //插入前查找
                $where['where']['invite_user_id'] = $_param['invite_user_id'];
                $where['where']['company_id'] = $findData['info']['company_id'];
                $where['where']['items_id'] = $findData['info']['id'];
                $where['field'] = 'id';
                $array = $this->getArray($where);
                if ($array['code'] == 200) {
                    return ['code' => 402, 'info' => lang('message402')];
                }
                $array = $this->add($_param);
            }
            
            


            //$this->commit();
        } catch (Exception $e) {
            //$this->rollback();
            $array = ['code' => 401, 'info' => $e->getMessage()];
        }
        return $array;
    }

    /***
     * 处理分享表的记录
     * @param
     *
     **/
    public function setInvitePath($param)
    {
        $array = [];
        $_param = [];
        $inData = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => [lang('message401')]];
        }
        if (empty($param['items_dir_id']) && empty($param['items_id'])) {
            return ['code' => 401, 'info' => [lang('message401')]];
        }
        $itemModel = new  Items();//操作项目
        $itemsDirModel = new  ItemsDir();
        try {
            if (!empty($param['items_dir_id'])) {// 移动文件夹及其下面的项目
                $_param['where']['id'] = $param['items_dir_id'];
                $_param['field'] = 'path';
                $array = $itemsDirModel->getArr($_param);
                if ($array['code'] != 200) {
                    return ['code' => 401, 'info' => [lang('message401')]];
                }
                $pathSelect = $array['info']['path'];
                $dirPathData = $itemsDirModel->where('path', 'like', $pathSelect . '%')->field('id,dir_father_id,path')->select();
                if (!empty($dirPathData)) {
                    foreach ($dirPathData as $k => $v) {
                        $inData['where']['items_dir_id'] = $v['id'];
                        $inData['field']['father_id'] = $v['dir_father_id'];
                        $inData['field']['path'] = $v['path'];
                        $_data = $this->update($inData['field'], $inData['where']);
                    }
                }
                $dirPathData = $itemModel->where('path', 'like', $pathSelect . '%')->field('id,items_dir_id,path')->select();
                if ($dirPathData) {
                    $inData = [];
                    foreach ($dirPathData as $k => $v) {
                        $inData['where']['items_id'] = $v['id'];
                        $inData['field']['father_id'] = $v['items_dir_id'];
                        $inData['field']['path'] = $v['path'];
                        $_data = $this->update($inData['field'], $inData['where']);
                    }
                }
                //$_data = $this->saveAll($inData);
            }
            if (!empty($param['items_id'])) {// 移动项目
                $_param['where']['id'] = $param['items_id'];
                $_param['field'] = ['items_dir_id', 'path'];
                $array = $itemModel->getArr($_param);
                if ($array['code'] != 200) {
                    return ['code' => 401, 'info' => [lang('message401')]];
                }
                $data['father_id'] = $array['info']['items_dir_id'];
                $data['path'] = $array['info']['path'];
                $where['items_id'] = $param['items_id'];
                $_data = $this->update($data, $where);
            }
            if (!empty($_data)) {
                $array = ['code' => 200, 'message' => [lang('message200')]];
            }
        } catch (Exception $exception) {
            return ['code' => 500, 'info' => [$exception->getMessage()]];
        }
        return $array;
    }

    /**
     * 修改合作者对文件夹或项目的操作权限
     */
    public function editInviteItems($param){
        /**
         *$param['items_id'] = $entity['item_id'];
          *  $param['email'] = $entity['email'];//被编辑人邮箱
         *  // $param['user_id'] = $userData['user_id'];// 邀请者ID
         *   $param['edit_type'] = $entity['type'];//可编辑类型，1查看，2编辑，3删除
        *    $param['file_type'] = $entity['file_type'];// 文件夹1 或者项目2
        *    $param['company_id'] = $userData['company_id'];
        *    $param['user_type'] = $userData['user_type']; 
         */
         $findUser = \model('user')->where(['email' => sha1($param['email']) , 'company_id' => $param['company_id'] ])->field('user_type,is_use,company_id,id') ->find();
         if(empty($findUser)){
            return ['code'=>202,'message'=>'被编辑的用户不存在！','data'=>[] ];
         }
         if($findUser['user_type'] != 3){ //不是合作者，理论上列表中是不应该出现合作者的
            return ['code'=>202,'message'=>'被编辑的用户类型不是是合作者！','data'=>[] ];
         }

         $find_items_id_param = [];
         $find_items_id_param['where']['company_id'] = $param['company_id'];
         $find_items_id_param['where']['invite_user_id'] = $findUser['id'];
         $find_items_id_param['field'] = ['*'];

         if($param['file_type'] == 1){ //编辑文件夹
            $find_items_id_param['where']['items_dir_id'] = $param['items_id'];
         }elseif($param['file_type'] == 2){//编辑项目
            $find_items_id_param['where']['items_id'] = $param['items_id'];
         }else{
             return ['code'=>202,'message'=>'file_type is error','data'=>[] ];
         }
         $get_items_dir_message = $this->getArray( $find_items_id_param);//找到需要改变权限的文件夹或项目
         if($get_items_dir_message['code'] != 200){ //证明被编辑者没有可以管理该文件夹或项目
            return ['code'=>202,'message'=>'被编辑的合作者没有管理该项目！','data'=>[] ];
         }

         
         if($param['file_type'] == 1){ //编辑文件夹
            $get_dir_param = [];
            $get_dir_param['where']['path'] = ['like',$get_items_dir_message['info']['path'].'%'];
            $get_dir_param['where']['company_id'] = $param['company_id'];
            $get_dir_param['where']['invite_user_id'] = $findUser['id']; //被修改的用户id
            $get_dir_param['field'] = ['id,edit_type'] ;//
            $get_dir_message = $this->getList( $get_dir_param);
            if($get_dir_message['code'] != 200){
                return ['code'=>202,'message'=>'被编辑的合作者管理为空！','data'=>[] ];
            }
            $get_dir_data = json_decode( $get_dir_message['info'],true);//获取回来的数据
            
            $one_message_temp = [];//把自己增加进去
            $one_message_temp['id'] = $get_items_dir_message['info']['id'];
            $one_message_temp['edit_type'] = $get_items_dir_message['info']['edit_type'];
            $get_dir_data[] = $one_message_temp;

            if($param['edit_type'] == 1 ){ //修改为查看
                if($get_items_dir_message['info']['edit_type'] == 1){
                    return ['code'=>202,'message'=>'请转换修改类型！','data'=>[] ];
                }

                foreach($get_dir_data as $k=>$v){
                   if($v['edit_type'] == 1){
                    unset($get_dir_data[$k]);
                   }else{
                    $get_dir_data[$k]['edit_type'] = 1;//修改权限
                   }


                }
                $save_all_data = $this->saveAll($get_dir_data);
                if($save_all_data){
                    return ['code' => 200,'message'=>'文件夹权限已修改为仅查看！','data'=>[]];
                }else{
                    return ['code' => 202,'message'=>'文件夹权限修改为仅查看异常！','data'=>[]];
                }
                
            }else if($param['edit_type'] == 2){ //修改为编辑
                if($get_items_dir_message['info']['edit_type'] == 2){
                    return ['code'=>202,'message'=>'请转换修改类型！','data'=>[] ];
                }
                foreach($get_dir_data as $k=>$v){
                    if($v['edit_type'] == 2){
                       unset($get_dir_data[$k]);
                    }else{
                        $get_dir_data[$k]['edit_type'] = 2;//修改权限
                    }
 
 
                 }
                 $save_all_data = $this->saveAll($get_dir_data);
                 if($save_all_data){
                     return ['code' => 200,'message'=>'文件夹权限已修改为可编辑！','data'=>[]];
                 }else{
                     return ['code' => 202,'message'=>'文件夹权限修改为可编辑异常！','data'=>[]];
                 }

            }else if($param['edit_type'] == 3){ //删除
                $delete_id = [];
                foreach($get_dir_data as $v){
                    $delete_id[] = $v['id'];
                }
                $temp_param_delete = [];
                $temp_param_delete['where']['id'] = ['in',$delete_id];
                

                $delete_all_data = $this->del($temp_param_delete);
                if($delete_all_data['code'] == 200){
                    return ['code' => 200,'message'=>'文件夹权限已经被删除','data'=>[]];
                }else{
                    return ['code' => 202,'message'=>'文件夹权限删除编辑异常！','data'=>[]];
                }
                
            }else{
                return ['code'=>202,'message'=>'type is error','data'=>[] ];
            }


         }else if($param['file_type'] == 2){//编辑项目
            
            $update_temp_edittype = [];
            $update_temp_edittype['where']['id'] = $get_items_dir_message['info']['id'];
            
            if($param['edit_type'] == 1 ){ //修改为查看
                if($get_items_dir_message['info']['edit_type'] == 1){
                    return ['code'=>202,'message'=>'请转换修改类型！','data'=>[] ];
                }
                $update_temp_edittype['field']['edit_type'] = 1;
                $_save_message = $this->up($update_temp_edittype);
                if($_save_message['code'] == 200 ){
                    return ['code' => 200,'message'=>'项目权限已修改为仅查看！','data'=>[]];
                }else{
                    return ['code' => 202,'message'=>'项目权限修改为仅查看异常！','data'=>[]];
                }

            }else if($param['edit_type'] == 2){ //修改为编辑
                if($get_items_dir_message['info']['edit_type'] == 2){
                    return ['code'=>202,'message'=>'请转换修改类型！','data'=>[] ];
                }
                $update_temp_edittype['field']['edit_type'] = 2;
                $_save_message = $this->up($update_temp_edittype);
                if($_save_message['code'] == 200 ){
                    return ['code' => 200,'message'=>'项目权限已修改为可编辑！','data'=>[]];
                }else{
                    return ['code' => 202,'message'=>'项目权限修改为可编辑异常！','data'=>[]];
                }
    
            }else if($param['edit_type'] == 3){ //删除
                $detete_id_temp = [];
                $detete_id_temp['where']['id'] = $get_items_dir_message['info']['id'];
                $delete_message = $this->del( $detete_id_temp);
                if($delete_message['code'] == 200){
                    return ['code' => 200,'message'=>'项目权限已经被删除','data'=>[]];
                }else{
                    return ['code' => 202,'message'=>'项目权限删除编辑异常！','data'=>[]];
                }

            }else{
                return ['code'=>202,'message'=>'type is error','data'=>[] ];
            }

         }

        

        return ['code'=>202,'message'=>'','data'=>[]];

        
    }


}

?>