<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/12
 * Time: 11:09
 */

namespace app\index2\model;

use think\Model;

class User extends Model
{
    protected $rule = [
        ['user_type', 'require|number|length:1,4', '用户ID必须|数据类型不符|长度在1到4位'],
        ['company_id', 'require|number|length:1,11', '公司ID必须|数据类型不符|长度在1到11位'],
        ['nickname', 'chsDash|length:2,25', '数据类型不符|长度在2到25位'],
        ['username', 'chsDash|length:2,25', '数据类型不符|长度在2到25位'],
        ['lastname', 'chsDash|length:1,25', '数据类型不符|长度在1到25位'],
        ['firstname', 'chsDash|length:2,25', '数据类型不符|长度在2到25位'],
        //['email', '', 'alphaDash', '邮箱加密格式不符'],
        ['decrypt_email', 'email', '邮箱格式不符'],
        ['phone', 'alphaDash', '手机号码加密格式不对'],
        ['decrypt_phone', 'require|number|length:11', '手机号码必须|数据类型不符|手机长度11位'],
        ['password', 'require|chsDash', '密码必须|数据类型不符'],
    ];
    //修改前验证
    protected $uprule = [
        ['user_type', 'number|length:1,4', '数据类型不符|长度在1到4位'],
        ['company_id', 'number|length:1,11', '数据类型不符|长度在1到11位'],
        ['nickname', 'chsDash|length:2,25', '数据类型不符|长度在2到25位'],
        ['username', 'chsDash|length:2,25', '数据类型不符|长度在2到25位'],
        ['lastname', 'chsDash|length:1,25', '数据类型不符|长度在1到25位'],
        ['firstname', 'chsDash|length:1,25', '数据类型不符|长度在1到25位'],
        //['email', '', 'alphaDash', '邮箱加密格式不符'],
        ['decrypt_email', 'email', '邮箱格式不符'],
        ['phone', 'alphaDash', '手机号码加密格式不对'],
        ['decrypt_phone', 'number|length:11', '数据类型不符|手机长度11位'],
        ['password', 'chsDash', '数据类型不符'],
    ];

    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'user';//  实例话对象表名称
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

    /**数据中间层**/
    /***
     *
     ***/
    public function editUser($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['id'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
        }
        $param['where']['id'] = $param['id'];
        if (!empty($param['lastname'])) {
            $code = getSterlen($param['lastname'], 1, 25);
            if ($code != 200) {
                return ['code' => 401, 'info' => $array[lang('message' . $code)]];
            }
            $param['field']['lastname'] = $param['lastname'];
        }
        if (!empty($param['firstname'])) {
            $code = getSterlen($param['firstname'], 2, 25);
            if ($code != 200) {
                return ['code' => 401, 'info' => $array[lang('message' . $code)]];
            }
            $param['field']['firstname'] = $param['firstname'];
        }
        if (!empty($param['phone'])) {
            $param['field']['phone'] = sha1(md5(decrypt($param['phone'])));
            $param['field']['decrypt_phone'] = decrypt($param['phone']);
        }
        if (!empty($param['email'])) {
            $param['field']['email'] = sha1(md5(decrypt($param['email'])));
            $param['field']['decrypt_email'] = decrypt($param['email']);
        }
        if (!empty($param['password'])) {
            if (empty($param['origpassword'])) {
                return ['code' => 401, 'info' => $array[lang('is_empty')]];
            }
            if ($param['password'] != $param['regpassword']) {
                return ['code' => 406, 'info' => $array[lang('message406')]];
            }
            $userData = $this->where($param['where'])->field('password_key,password')->find();
            if (sha1($param['origpassword'] . md5($userData['password_key'])) != $userData['password']) {
                return ['code' => 405, 'info' => lang('message405')];
            }
            $param['field']['password'] = sha1($param['password'] . md5($userData['password_key']));
        }
        
        $array = $this->up($param);
        if ($array['code'] != 200) {                        
            return $array;
        }
        $_param['where']['id'] = $param['where']['id'];
        $_param['field'] = ['lastname', 'firstname', 'decrypt_email as email', 'decrypt_phone as phone'];
        $array = $this->getArr($_param);
        return $array;
    }

    


}

?>