<?php
namespace excel;
class Excel
{    // ob函数缓存的开始
    public static function start ()
    {
        ob_start();
    }    // 获取缓存内容
    public static function save ($path)
    {
        $data = ob_get_contents();
        ob_end_clean();
        self::writeToExcel($path, $data);
    }    //写到文件
    private static function writeToExcel ($fn, $data)
    {
        $dir = self::setDir();
        $fp = fopen($dir . '/'. $fn, 'wb');
        fwrite($fp, $data);
        fclose($fp);
    }    //excel默认是GKB，所有要转码
    public static function setChar ($value, $inchar = 'utf-8', $outchar ='gbk')
    {       
    return  iconv($inchar, $outchar, $value);//转化编码   
    }   
    //创建目录，linux系统一般要写到文件，目录需要w谦虚，而文件需要x权限，为了省事直接建立子文件夹，可以不需要修改谦虚
    public static function setDir($dirName = 'excel')
    {        if(!is_dir($dirName)) {
            mkdir($dirName);
        }        return $dirName;
    }
}