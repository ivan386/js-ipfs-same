var shell = WScript.CreateObject("WScript.Shell");
var hashes = {}
var copys_size = 0;


function search_hashes(hash)
{
	WScript.StdOut.Write(hash + "\t\t\t\r");
	var ipfs = shell.Exec("ipfs object links " + hash);
	var stream = ipfs.StdOut;
	var hash_list = [];
	
	while(!stream.AtEndOfStream)
	{
		var line = stream.ReadLine();
		if (line)
		{
			var hash = line.split(" ");
			hash_list.push(hash);
		}
	}
	
	for (var i = 0; i < hash_list.length; i++)
	{
		var hash = hash_list[i][0];
		var size = hash_list[i][1];
		if (!hashes[hash])
		{
			if ((/^Qm/).test(hash))
				search_hashes(hash);
			hashes[hash] = 1;
		}
		else
		{
			hashes[hash]++;
			copys_size += +size;
			WScript.Echo(hash, hashes[hash], size, "(Copy size: " + copys_size + " )")
		}
	}
}

function main()
{
	if (WScript.Arguments.Length >= 1)
	{
		for (var i = 0; i < WScript.Arguments.Length; i++)
			search_hashes(WScript.Arguments.Item(i));
		
		WScript.Echo("Copy size:", copys_size, "\t\t\t\t\t");
	}
}

main()