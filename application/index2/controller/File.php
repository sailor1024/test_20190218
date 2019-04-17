<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/7
 * Time: 18:10
 */

namespace app\index2\controller;

use app\common\Token;
use app\index2\model\InviteCooperator;
use app\index2\model\Items;
use app\index2\model\ItemsDir;
use think\Exception;

class File extends Base {
    private $ItemDirMod;//模型实列话
    private $InviteCooperatorMode;
    protected $ItmesDirfield = [
        'id' => 0,
        'dir_name' => '',
        'dir_father_id' => 0,
        'items_num' => 0,
        'user_id' => 0,
        'company_id' => '',
        'path' => '',
        'create_time' => 0,
        'update_time' => 0,
        'valid' => 0
    ];

    public function __construct() {

    }

    /* //获取model.json中的图片信息
    public function getJson()
    {
        $path = input('param.path');
        if (!empty($path)) {
            $modelPath = "./edit/path/$path/model.json";
            $content = file_get_contents($modelPath);
            $contents = json_decode($content);

            $slider = $contents->slider;
            if (isset($slider)) {
                $this->json_echo($slider);
            } else {
                $slider = '';
                $this->json_echo($slider);
            }
        }
    } */

    /**
     * 创建文件夹
     */
    public function create(InviteCooperator $inviteCooperator, ItemsDir $itemsDir) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $param['create_time'] = time();
            $param['update_time'] = time();
            $param['user_id'] = $userData['user_id'];
            $param['company_id'] = $userData['company_id'];// 公司ID
            $param['dir_name'] = $entity['dir_name'];// 文件夹名称
            $param['dir_father_id'] = $entity['dir_id'];//父文件夹
            if ($param['dir_father_id'] > 0) { // 判断该用户的操作权限
                $param['items_id'] = $param['dir_father_id'];
                $fileStatus = $inviteCooperator->jurisdiction($param);
                if ($fileStatus == 1) {//操作权限判断
                    $this->setResult(400);
                    $this->json_msg($this->result);

                }
            } else {//合作者首页显示问题，只有首页才会执行 kesheng
                $param['high_floor'] = 1;
            }
            unset($param['items_id']);
            //$entity = $this->set_array_null($this->ItmesDirfield, $entity);
            $this->result['data'] = $itemsDir->setPath($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 修改文件夹名
     */
    public function redirname(InviteCooperator $inviteCooperator, ItemsDir $itemsDir) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_dir_id'] = $entity['dir_id'];
            $fileStatus = $inviteCooperator->jurisdiction($userData);
            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }
            $param['field']['update_time'] = time();
            $param['field']['dir_name'] = $entity['dir_name'];
            $param['where']['id'] = $entity['dir_id'];
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }
            $this->result['data'] = $itemsDir->upFileName($param);
            $this->setResult($this->result['data']['code']);
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 移动文件夹
     **/
    public function movedir(InviteCooperator $inviteCooperator, ItemsDir $itemsDir) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_dir_id'] = $entity['dir_id'];
            $fileStatus = $inviteCooperator->jurisdiction($userData);
            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            $param['where']['id'] = $entity['id'];//文件夹ID
            $param['field']['dir_father_id'] = $entity['dir_id'];
            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }
            $this->result['data'] = $itemsDir->fetchUpPath($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        $this->json_msg($this->result);
    }

    /**
     * 删除文件夹
     *
     **/
    public function delete_dir(InviteCooperator $inviteCooperator, ItemsDir $itemsDir) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_dir_id'] = $entity['id'];// ID
            $fileStatus = $inviteCooperator->jurisdiction($userData);

            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            $param['where']['id'] = $entity['id'];//文件夹ID

            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                //$param['where']['user_id'] = $userData['user_id'];
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $this->result['data'] = $itemsDir->rmFile($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /***
     *  搜索接口
     **/
    public function search(Items $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $param['key'] = $entity['key'];
            $param['page'] = $entity['page'];
            $param['type'] = $entity['type'];
            $param['user_id'] = $userData['user_id'];
            $param['user_type'] = $userData['user_type'];
            $param['company_id'] = $userData['company_id'];
            $this->result['data'] = $items->searchData($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     *获取目录列表
     */

    public function filelist() {
        $entity = input('param.');
        $this->setResult(false);

        try {

        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        $this->json_msg($this->result);
    }

    /**
     * 获取文件夹所有目录
     */
    public function get_dir_list(ItemsDir $itemsDir) {
        $entity = input('param.');
        $this->setResult(false);
        try {
            $param = [];
            /*
                $entity['user_type'] = 3;
                $entity['user_id'] = 2;
                $entity['company_id'] = 1;
             */
            $this->result['message'] = lang('message400');
            /* $fileStatus = $this->InviteCooperatorMode->jurisdiction($entity);
            if ($fileStatus == 1) {//操作权限判断
                $this->json_msg($this->result);
            } */
            $this->result = $itemsDir->getDirList($entity);
            /* if($this->result['code'] != 200){
                $this->json_msg($this->result);
            } */
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        
        $this->json_msg($this->result);
    }


}

?>