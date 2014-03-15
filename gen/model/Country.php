<?php

class Country {
	protected static $data = array();
	public $id;
	public $name;

	public function __construct($id, $name)
	{
		$this->id = $id;
		$this->name = $name;
	}
	
	public static function Add(Country $item) {
		self::$data["c{$item->id}"] = $item;
	}

	public static function Get($id) {
		return self::$data["c{$id}"];
	}

	public static function Load($data)
	{
		foreach ($data as $item) {
			self::Add(new Country($item->id, $item->name));
		}
	}

	public static function Dump()
	{
		var_dump(self::$data);
	}
}

?>