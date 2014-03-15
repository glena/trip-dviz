<?php

class City {
	protected static $data = array();
	public $id;
	public $name;

	public function __construct($id, $name)
	{
		$this->id = $id;
		$this->name = $name;
	}
	
	public static function Add(City $item) {
		self::$data["c{$item->id}"] = $item;
	}

	public static function Get($id) {
		if (isset(self::$data["c{$id}"]))
			return self::$data["c{$id}"];
		return null;
	}

	public static function Load($data)
	{
		foreach ($data as $item) {
			self::Add(new City($item->id, $item->name));
		}
	}

	public static function Dump()
	{
		var_dump(self::$data);
	}
}

?>