<?php

require 'gen/model/CountryVisit.php';
require 'gen/model/CityVisit.php';
require 'gen/model/PointVisit.php';

$data = json_decode(file_get_contents('gen/originaldata/points.json'));

$newdata = array();

$lastCountry = null;
$lastCity = null;
$obj = null;
$cityVisit = null;

foreach ($data as $item)
{
    if ($lastCountry != $item->country_id)
    {
        echo "Country: {$item->country}\n";

        $countryVisit = CountryVisit::Get($item);
		
        $lastCountry = $countryVisit->id;
    }

    if ($lastCity != $item->city_id)
    {
        echo "\t City: {$item->city}\n";

        $cityVisit = $countryVisit->getCity($item);

        $lastCity = $cityVisit->id;
    }

    echo "\t\t{$countryVisit->name} - {$cityVisit->name}\n";

	$pointVisit = new PointVisit($item);
	$cityVisit->addPoint($pointVisit);

}

file_put_contents('app/data/data.json', json_encode(CountryVisit::All()));

?>