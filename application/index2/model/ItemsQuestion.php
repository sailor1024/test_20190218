<?php

namespace app\index2\model;

use think\Model;

class ItemsQuestion extends Model
{
    protected $rule = [
        ['question_type', 'require|number|length:1,2', '项目类型必须|数据类型不符|长度在1到2位'],
        ['question_msg', 'require|chsDash|length:1,50', '项目类型信息必须|数据类型不符|长度在1到50位'],
        ['question_description', 'chsDash|length:1,500', '数据类型不符|长度在1到500位'],        
        ['dirname', 'chsDash|length:1,50', '数据类型不符|长度在1到50位'],
        ['contact_phone', 'chsDash|length:1,50', '数据类型不符|长度在1到50位'],  
        
    ];
    //修改前验证
    protected $uprule = [
        ['question_type', 'require|number|length:1,2', '项目类型必须|数据类型不符|长度在1到2位'],
        ['question_msg', 'require|chsDash|length:1,50', '项目类型信息必须|数据类型不符|长度在1到50位'],
        ['question_description', 'chsDash|length:1,500', '数据类型不符|长度在1到500位'],        
        ['dirname', 'chsDash|length:1,50', '数据类型不符|长度在1到50位'],
        ['contact_phone', 'chsDash|length:1,50', '数据类型不符|长度在1到50位'], 
    ];

    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'items_question';//  实例话对象表名称
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
     * 
     * param page 页数
     * param limit_num 每页条数
     */

    public function getList($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }


         //分页,page_num:从那条开始，limit_num：限制一次多少条
         $limit_num = !empty($param['limit']['limit_num']) ? $param['limit']['limit_num'] : 10;
         $page = !empty($param['limit']['page']) ? $param['limit']['page'] : 1;
         if ($page == '') {
             $page_num = 0;
         } else {
             $page_num = $limit_num * ($page - 1);
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
        if ($array = $this->where($where)->field($field)->limit( $page_num,$limit_num)->order($order)->select()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];

    }

    /**数据中间层**/
    /***
     *
     ***/
    

    


}

?>