<?php
/**
 * @title 注册登录
 * @class UserA
 */
class User  {


	/**
	 * @title 用户登录
	 * @url /index/user/user_login
	 * @param string phone 登录的手机号码 空 必须
	 * @param string password 登录密码 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 返回的用户数据数据
	 * @return string data[].id 用户唯一id
	 * @return string data[].lastname 用户姓
	 * @return string data[].famailname 返回的用户名称
	 * @return string data[].username 用户名
	 * @return string data[].email 邮箱
	 * @return string data[].niname 昵称
	 */
	public function user_login(){
		$phone = input('param.phone');
		$password = md5(md5(input('param.password')));
		$res = model('User')->find_user($phone,$password);		
		$this->json_echo($res);
	}

	/**
	 * @title 用户注册
	 * @url /index/user/regist
	 * @param string lastname 姓氏 空 必须
	 * @param string famailname 名 空 必须
	 * @param string phone 手机号 空 必须
	 * @param string password 密码 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 空对象
	 */
	public function regist(){
		$lastname = input('param.lastname');
		$famailname = input('param.famailname');
		$phone = input('param.phone');
		$password = md5(md5(input('param.password')));
		$code = model('User')->regist($lastname, $famailname, $phone, $password);
		$this->json_echo([],$code);
	}

	/**
	 * @title 判断手机号是否注册
	 * @url /index/user/has_regist
	 * @param string phone 手机号 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 空对象
	 */
	public function has_regist(){
		$phone = input('param.phone');
		$code = model('User')->has_regist($phone);
		$this->json_echo([],$code);
	}

	/**
	 * @title 重置密码
	 * @url /index/user/reset_pass
	 * @param string phone 手机号 空 必须
	 * @param string password 新密码 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 空对象
	 */
	public function reset_pass(){
		$phone = input('param.phone');
		$password = md5(md5(input('param.password')));
		$res = model()->reset_password($phone, $password);
		$this->json_echo($res);
	}

	/**
	 * @title 发送验证码
	 * @url /index/user/captche_code
	 * @param string phone 手机号 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 包含验证码的对象
	 */
	public function captche_code() {

		$phone = input('param.phone');
		$strcode = substr(uniqid(),0,6);

		$code = $this->send_code($phone ,[$strcode, '5'],"1");

		$resarr = array(
			'captche'=>$strcode
		);
		$this->json_echo($resarr,$code);
	}
}