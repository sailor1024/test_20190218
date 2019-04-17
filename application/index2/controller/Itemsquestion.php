<?php
namespace app\index2\controller;

use app\index2\model\ItemsQuestion as ItemsQuestionModel;
use think\Exception;

class Itemsquestion extends Base {
    //添加用户反馈信息
    public function add_question(ItemsQuestionModel $itemsQuestion) {
        //https://todo.kangyun3d.cn/index.php/index2/itemsquestion/add_question?dirname=6e7b7abf86df5501631bc5e93ec575f0&question_msg=其他&question_type=9
        //https://doc.kangyun3d.cn/web/#/page/edit/9/343
        $result = array(
            'data' => [],
            'message' => 'send error',
            'code' => 401,

        );
        try {
            $save_param = [];
            $entity = input('param.');
            //$entity['dirname'] = '6e7b7abf86df5501631bc5e93ec575f0';
            if (empty($entity['question_type'])) {
                throw new \Exception('请输入 question_type');
            } else {
                if ($entity['question_type'] == 0 || $entity['question_type']> 9) {
                    $entity['question_type'] = 9;
                }
            } 
            ///问题信息（3D模型, 房屋照片，户型图，文字标签，三维标尺，VR讲房，经纪人，房源信息，其他）
            $arr_question_msg = ['下标0—占位','3D模型','房屋照片','户型图','文字标签','三维标尺','VR讲房','经纪人','房源信息','其他'];
            $entity['question_msg'] = $arr_question_msg[$entity['question_type']];
            /* if(empty($entity['question_msg'])) {
                throw new \Exception('请输入 question_msg');
            } */
            $save_param['question_msg'] = $entity['question_msg'];
            $save_param['question_type'] = $entity['question_type'];
            $save_param['create_time'] = time();
            $save_param['is_solve'] = 0;
            
            if (!empty($entity['dirname'])) {//项目目录
                $save_param['dirname'] = $entity['dirname'];
            }

            if (!empty($entity['contact_phone'])) {//联系号码
                $save_param['contact_phone'] = $entity['contact_phone'];
            }

            if (!empty($entity['question_description'])) {//描述
                $save_param['question_description'] = $entity['question_description'];
            }

            $items_questionData =$itemsQuestion->add($save_param);

            if ($items_questionData['code'] == 200) {
                $result = array(
                    'data' => ['id'=>$items_questionData['id']],
                    'message' => 'send success!',
                    'code' => 200,
                );
            } else {
                $result['message'] = $items_questionData['info'];
            }
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $this->json_msg($result);
        }
        $this->json_msg($result);
    }

    //添加用户反馈信息列表
     public function get_question_list(ItemsQuestionModel $itemsQuestion) {
        // https://todo.kangyun3d.cn/index.php/index2/itemsquestion/get_question_list
        // https://doc.kangyun3d.cn/web/#/9?page_id=344
        $result = array(
            'data' => [],
            'message' => 'get error',
            'code' => 401,
        );
        try {
            $save_param = [];
            $entity = input('param.');
            //$entity['dirname'] = '6e7b7abf86df5501631bc5e93ec575f0';
            $limit_num = !empty($entity['limit_num'])?$entity['limit_num']:10;//每页多少条
            $page = !empty($entity['page'])?$entity['page']:1;//哪页
            $save_param['limit']['limit_num'] =$limit_num ;
            $save_param['limit']['page'] = $page ;
            $save_param['field'] = ['id,dirname,question_type,question_msg,question_description,create_time,update_time,is_solve,contact_phone'];
            $save_param['order'] = 'id desc';
            $items_questionData = $itemsQuestion->getList($save_param);
            if ($items_questionData['code'] == 200) {
                $result = array(
                    'data' => $items_questionData['info'],
                    'message' => 'get success!',
                    'code' => 200,
        
                );
            } else {
                $result['message'] = $items_questionData['info'];
            }
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $this->json_msg($result);
        }
        $this->json_msg($result);
    } 

    //添加用户反馈信息单条信息
    public function get_question_one(ItemsQuestionModel $itemsQuestion) {
        // https://doc.kangyun3d.cn/web/#/9?page_id=345
        // https://todo.kangyun3d.cn/index.php/index2/itemsquestion/get_question_one?id=3
        $result = array(
            'data' => [],
            'message' => 'get error',
            'code' => 401,
        );
        try {
            $get_param_one = [];
            $entity = input('param.');
            //$entity['dirname'] = '6e7b7abf86df5501631bc5e93ec575f0';
            if (empty($entity['id'])) {
                throw new \Exception('请输入 反馈问题id');
            }
            $get_param_one['where']['id'] = $entity['id'];
            $get_param_one['field'] = ['id,dirname,question_type,question_msg,question_description,create_time,update_time,is_solve,contact_phone'];
            $items_questionData = $itemsQuestion->getArr($get_param_one);
            if ($items_questionData['code'] == 200) {
                $result = array(
                    'data' => $items_questionData['info'],
                    'message' => 'get success!',
                    'code' => 200,
                );
            } else {
                $result['message'] = $items_questionData['info'];
            }
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $this->json_msg($result);
        }
        $this->json_msg($result);
    }

}