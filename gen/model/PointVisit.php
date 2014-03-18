<?php

class PointVisit {

    public $id;
    public $name;
    public $date;
    public $description;
    public $latitude;
    public $longitude;
    public $point_order;
    public $photo;
    
    public function __construct($point)
    {
        $this->id = $point->id;
        $this->name = $point->name;
        $this->date = date('Y-m-d', strtotime($point->date));
	    $this->description = $point->description;
	    $this->latitude = $point->latitude;
	    $this->longitude = $point->longitude;
        $this->point_order = $point->point_order;
	    $this->photo = $point->photo;
    }

}

?>