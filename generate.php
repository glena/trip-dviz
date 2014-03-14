<?php

$data = json_decode(file_get_contents('convertcsv.json'));

$newdata = [];

foreach ($data as $item)
{
	if (!isset($newdata[ 'c'.$item->country_id ]))
	{
		$newdata[ 'c'.$item->country_id ] = [
			'country_id' => 'c'.$item->country_id,
			'name' => null,
			'dates' => []
		];
	}

	$date = strtotime($item->date);
	$strdate = date('y-m-d', $date);

	if (!isset($newdata[ 'c'.$item->country_id ]['dates'][$strdate]))
	{
		$newdata[ 'c'.$item->country_id ]['dates'][$strdate] = [
			'date' => $strdate,
			'points' => []
		];
	}

	$newdata[ 'c'.$item->country_id ]['dates'][$strdate]['points'][] = $item;
}

file_put_contents('data.json', json_encode($newdata));
?>