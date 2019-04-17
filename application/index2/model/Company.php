<?php

namespace app\index2\model;

use app\index2\model\User;
use think\Exception;
use think\Model;

class Company extends Model
{
    protected $rule = [
        
        ['company_name', 'length:1,55', '组织名称长度大于1小于55'],
    ];
    //修改前验证
    protected $uprule = [
        ['company_name', 'length:1,55', '组织名称长度大于1小于55'],
    ];
    //主要调用的方法是
    /**
     *
     *
     * 1.index2/items/get_dir_tree()     主要是获取所有自己能管理的目录，用树杈的方式显示出来
     * 2.index2/items/get_dir_list()     主要是获取所有自己能管理的目录，用一维数组出来
     * 3.index2/items/get_dir_page()     主要是获取所有自己能管理的目录，已经做了父级目录限制，例如：当dir_father_id =0
     * 3.index2/items/get_items_list()   主要是获取所有自己能管理的项目，已经做了父级目录限制，例如：当items_dir_id =0
     * 4.index2/items/space_list()       主要是获取所有自己能管理的项目与目录，获取的是 get_dir_page()+ get_items_list()
     *
     * http://localhost/test_3/20181026/ky/todo/todo.kangyun3d.cn/public/index.php/index2/items/rename_dir
     *  */
    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'company';//  实例话对象表名称
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

        if (!empty($param['limit_num'])) {
            $page = $param['page'];
            $limit_num = $param['limit_num'];
            if ($array = $this->where($where)->field($field)->order($order)->paginate(['page' => $page, 'list_rows' => $limit_num])) {
                return ['code' => 200, 'info' => $array];
            }
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

    /****数据中间层****/
    
    /**
     * 组织信息
     */
    public function organizationMessage($param){
        
           



            $_param['where']['id'] = $param['company_id']; //公司id
            $_param['field'] = ['id,company_name'];
            
            
            $getMessage = $this->getArr( $_param);
    }
   
}

