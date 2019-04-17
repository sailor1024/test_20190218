<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/12
 * Time: 11:31
 */

namespace app\index2\model;

use think\Model;

class UserToken extends Model
{
    protected $rule = [
        ['user_id', 'require|number|length:1,11', '用户ID必须|数据类型不符|长度在1到11位'],
        ['token', 'require|alphaDash', '用户token必须|数据类型不符'],
        ['begin_time', 'require|number', '写入时间必须|数据类型不符'],
        ['end_time', 'require|number', '修改时间必须|数据类型不符']
    ];
    //修改前验证
    protected $uprule = [
        ['user_id', 'number|length:1,11', '数据类型不符|长度在1到11位'],
        ['token', 'alphaDash', '数据类型不符'],
        ['begin_time', 'number', '数据类型不符'],
        ['end_time', 'number', '数据类型不符']
    ];

    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'user_token';//  实例话对象表名称
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
        if ($array = $this->where($where)->field($field)->order($order)->select()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];

    }

    /***
     *  修改器一
     **/
    public function getBeginTimeAttr($value)
    {
        return $value * 24 * 60 * 60;
    }

    /***
     * 修改器二
     **/
    public function getEndTimeAttr($value)
    {
        return $value * 24 * 60 * 60;
    }
    /**数据中间层**/
}

?>