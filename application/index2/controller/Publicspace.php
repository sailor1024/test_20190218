<?php
/**
 * Created by PhpStorm.
 * User: Deng DeLi
 * Date: 2018/11/15
 * Time: 10:05
 */

namespace app\index2\controller;

use app\index2\model\Items;
use app\common\Token;

class Publicspace extends Base {
//    protected $spaceSortKey = [
//        1 => 'time',
//        2 => 'name'
//    ];

    /**
     * 公共空间隐藏
     */
    public function isofficabmap(Items $items) {
        if (input('param.id') == null) {
            return json(['code' => 401, 'info' => [lang('reuqest public_space id')]]);
        } else {
            $pId = input('param.id');
        }

        $res = $items->isofficabmap($pId);
        $this->json_msg($res);
    }

    /**
     * 根据条件排序公共空间
     */
    public function sortspace(Items $items) {
        $params = input('param.');
//        $entity = [];
        $userData = Token::getUserGreps(['key_name'=>$params['_']]);
        //验证传参
//        $userData = ['user_type' => 3, 'user_id'=>2,'company_id'=>1];
        if (!is_array($params) || empty($params) || $userData['company_id'] == 0 || $params['page'] < 1 || $params['sort_type'] == 0) {
            return json(['code' => 400, 'message' => [lang('param miss')]]);
        }
        //每页数量暂时写死
        $params['limit_num'] = 10;
        //获取 user_id company_id 2019-04-11
        $params['company_id'] = $userData['company_id'];
        $params['user_id'] = $userData['user_id'];
         
//        $params['page'] = ($params['page'] * $params['limit_num']) - $params['limit_num'];

        $param = array_merge($params,$userData);
        //根据用户数据获取项目
        $unsort = $items->publicspacelist($param);
        if ($unsort===401) {
            $a = [
                'data' => [
                    'list' => [],
                    'total' => 0
                ]
            ];
            $this->json_msg($a);
        }
        //根据时间、名字排序公开空间列表
//        $res = $items->sortlist($unsort['res'], $params['sort_type']);
        $res= [
            'data'=>[
                'list'=>$unsort['res'],
                'total'=>$unsort['count']
            ]
        ];
        $this->json_msg($res);
    }
}