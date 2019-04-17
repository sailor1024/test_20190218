<?php
namespace app\index2\controller;

use app\common\Token;
use app\index2\model\Index as ModelIndex;

class Index extends Base
{
    public $full_clone;
    public $ffclone;

    /**
     * 主页
     */
    function index(){
        echo 'Come on, young man.';
    }

    /**
     * 空间列表
     * @param ModelIndex $modelIndex
     */
    public function space_list(ModelIndex $modelIndex) {
        $entity = input('param.');
        $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        $this->result['message'] = lang('message400');
        try {
            $entity['user_type'] = $userData['user_type'];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_id'] = $userData['user_id'];
            $this->result = $modelIndex->spaceList($entity);
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 邀请时显示已邀请的相关项目、文件夹下的合作者
     * @param ModelIndex $index
     */
    public function invite_cooperator_list(ModelIndex $index) {
        $entity = input('param.');
        $result = [];
        if (empty($entity)) {
            $result['code'] = '201';
            $result['message'] = '传参不能为空';//没有改账号
            $result['data'] = [];
        } else {
            $res = $index->invite_cooperator_list($entity);
            $result['data'] = $res;
            $result['message'] = '合作者列表';
            $result['code'] = 200;
        }
        $this->json_msg($result);
    }

    /**
     * 目前拥有该目录的合作者
     * @param ModelIndex $modelIndex ,好像没用
     */
    public function dir_items_coop(ModelIndex $modelIndex) {
        $entity = input('param.');
        $param = [];
        $this->result['message'] = lang('message400');
        try {
            $param['dir_items_id'] = $entity['dir_items_id'];
            $param['is_dir_items'] = $entity['is_dir_items'];
            $this->result = $modelIndex->dirItemsCoop($param);
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 项目详情【废弃】
     */
    public function space_detil() {
//        $id = input('param.id');
//        $userid = input('param.userid');
//        if (!empty($id) && !empty($userid)) {
//            $res = model('items')->where(['id' => $id])->find();
//            //获取项目的权限(查看或编辑)
//            $selItems = model('items')->where(['id' => $id, 'userid' => $userid])->find();
//            if ($selItems) {
//                $res['status'] = 2;
//            } else {
//                $selProjectUser = model('projectinviteuser')->where(['itemid' => $id, 'inviteid' => $userid])->find();
//                if (!empty($selProjectUser)) {
//                    $projectinvite_status = model('projectinvite')->where(['id' => $selProjectUser['projectid']])->select();
//                    $res['status'] = $projectinvite_status[0]['status'];
//                }
//            }
//            $this->add_visit($id, $userid);
//        }
//        $this->json_echo($res);
    }

}