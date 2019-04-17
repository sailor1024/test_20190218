<?php

namespace app\index2\controller;

use app\common\Token;
use app\index2\model\InviteCooperator;
use think\Exception;

class Email extends Base {
    //private $InviteCooperatorModel;
    public function index() {

    }

    //发送邮件邀请
    public function send_invite() {
        $entity = input("param.");
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_id'] = $userData['user_id'];
            $entity['user_type'] = $userData['user_type'];

            if ($userData['user_type'] == 3) {
                $result['message'] = '权限不够';
                $result['code'] = '202';
                $result['data'] = [];
                $this->json_msg($result);
            }

            $rs_data = model('Email')->send_invite($entity);
            $result = $rs_data;

        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }
        $this->json_msg($result);
    }

    //再次发送邮件邀请
    public function again_send_invite() {
        $entity = input("param.");
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_id'] = $userData['user_id'];
            $entity['user_type'] = $userData['user_type'];
            if ($userData['user_type'] == 3) {
                $result['message'] = '权限不够';
                $result['code'] = '202';
                $result['data'] = [];
                $this->json_msg($result);
            }

            $rs_data = model('Email')->again_send_invite($entity);
            $result = $rs_data;

        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
            $result['data'] = [];
        }

        $this->json_msg($result);
    }

    //删除邀请
    public function delete_invite() {
        $entity = input("param.");
        $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
        $entity['company_id'] = $userData['company_id'];
        $entity['user_id'] = $userData['user_id'];
        $entity['user_type'] = $userData['user_type'];

        if ($userData['user_type'] == 3) {
            $result['message'] = '权限不够';
            $result['code'] = '202';
            $result['data'] = [];
            $this->json_msg($result);
        }

        try {
            $rs_data = model('Email')->delete_invite($entity);
            $result = $rs_data;
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
            $result['data'] = [];
        }
        $this->json_msg($result);
    }

    /**
     * 项目或文件夹邀请合作者
     */
    public function email(InviteCooperator $inviteCooperator) {
        $entity = input("param.");
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $param['items_id'] = $entity['item_id'];
            $param['email'] = $entity['email'];//被邀请人邮箱
            $param['user_id'] = $userData['user_id'];// 邀请者ID
            $param['edit_type'] = $entity['type'];//可编辑类型
            $param['file_type'] = $entity['file_type'];// 文件夹1 或者项目2*/
            $param['company_id'] = $userData['company_id'];
            $param['user_type'] = $userData['user_type'];

            if ($userData['user_type'] == 3 && $entity['edit_type'] != 2 ) { //edit_type表示当前合作者对文件夹或项目的管理权限，2表示可以编辑，即而可以邀请
           // if ($userData['user_type'] == 3 && $entity['type'] == 1 ) { 
                $this->setResult(400);
                $this->json_msg($this->result);
            } else {
                $this->result['data'] = $inviteCooperator->setInvite($param);
                $this->setResult($this->result['data']['code']);
            }

        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 1.合作者拥有修改其他合作者 对文件夹或项目 的权限：
        *  A 是管理员，A创建了 文件夹 ‘我是文件夹’
        *  B 和 C 是合作者
        *  管理员A 将 文件夹 ‘我是文件夹’ 以可以编辑的权限 邀请给了 合作者B 和 合作者C ，
        *      合作者B 是否可以修改 合作者C 对文件夹 ‘我是文件夹’ 的编辑权限或者去除 合作者C 拥有 ‘我是文件夹’ 的权限。
        *  
       *  2.合作者没有修改其他合作者 对文件夹或项目 的权限：
     */

    public function edit_invite_items(InviteCooperator $inviteCooperator) {
        $entity = input("param.");
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $param['items_id'] = $entity['dir_item_id']; //修改的文件夹或项目
            $param['email'] = $entity['email'];//被编辑人邮箱，md5过来
           // $param['user_id'] = $userData['user_id'];// 邀请者ID
            $param['edit_type'] = $entity['type'];//可编辑类型，1查看，2编辑，3删除
            $param['file_type'] = $entity['file_type'];// 文件夹1 或者项目2*/
            $param['company_id'] = $userData['company_id'];
            $param['user_type'] = $userData['user_type'];

            if ($userData['user_type'] == 3 && $entity['edit_type'] != 2 ) { //edit_type表示当前合作者对文件夹或项目的管理权限，2表示可以编辑，即而可以邀请
           // if ($userData['user_type'] == 3 && $entity['type'] == 1 ) { 
                $this->setResult(400);
                $this->json_msg($this->result);
            } else {
                $this->result = $inviteCooperator->editInviteItems($param);
                //$this->setResult($this->result['data']['code']);
            }

        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

}