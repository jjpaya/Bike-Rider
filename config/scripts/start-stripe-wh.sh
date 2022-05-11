#!/bin/sh

uid=`stat -c '%u' /mnt`
gid=`stat -c '%g' /mnt`

sh <(cat << EOF
#!/bin/sh

until grep -o -E "whsec_[^ ]+" /tmp/stripe.log > /mnt/stripe_wh.key; do
  sleep 1;
done
echo got key
chown ${uid}:${gid} /mnt/stripe_wh.key
EOF
) &

/bin/stripe "${@}" 2>&1 | tee /tmp/stripe.log
